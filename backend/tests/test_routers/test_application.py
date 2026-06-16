import pytest
import uuid
from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient
from app.config import settings

def _unique_name(prefix: str) -> str:
    uid = uuid.uuid4().hex[:8]
    return f"{prefix}_{uid}"

@pytest.mark.asyncio
class TestApplicationSubmit:
    """Integration tests for POST /applications/{interview_id} resume upload."""

    async def _setup_users_and_interview(self, client: AsyncClient) -> tuple[dict[str, Any], dict[str, Any], int]:
        """Helper to create an organization, a candidate, and a valid interview."""
        org_username = _unique_name("org")
        org_email = f"{org_username}@example.com"
        
        # 1. Sign up organization
        org_res = await client.post(
            "/organizations/signup",
            json={
                "username": org_username,
                "password": "SecurePass123!",
                "email": org_email
            }
        )
        assert org_res.status_code == 201
        org_token = org_res.json()["access_token"]
        
        # 2. Create an interview
        now = datetime.utcnow()
        interview_res = await client.post(
            "/interviews/",
            headers={"Authorization": f"Bearer {org_token}"},
            json={
                "description": "Software Engineering role",
                "position": "Backend Developer",
                "experience": "Entry",
                "submission_deadline": (now + timedelta(days=2)).isoformat() + "Z",
                "start_time": (now + timedelta(days=3)).isoformat() + "Z",
                "end_time": (now + timedelta(days=5)).isoformat() + "Z",
                "duration": 45,
                "dsa_score": 40,
                "dev_score": 60,
                "resume_shortlist_score": 0.0,
                "ask_questions_on_resume": False,
                "questions": [
                    {"question": "What is FastAPI?", "expected_answer": "A modern web framework."}
                ],
                "dsa_topics": [
                    {"topic": "Arrays", "difficulty": "easy"}
                ]
            }
        )
        assert interview_res.status_code == 201
        interview_id = interview_res.json()["id"]

        # 3. Sign up candidate
        candidate_username = _unique_name("candidate")
        candidate_email = f"{candidate_username}@example.com"
        cand_res = await client.post(
            "/users/signup",
            json={
                "username": candidate_username,
                "password": "SecurePass123!",
                "email": candidate_email
            }
        )
        assert cand_res.status_code == 201
        candidate_data = cand_res.json()
        
        return org_res.json(), candidate_data, interview_id

    async def test_apply_success(self, client: AsyncClient) -> None:
        """A normal user should be able to upload a valid resume and apply successfully."""
        org_data, candidate_data, interview_id = await self._setup_users_and_interview(client)
        token = candidate_data["token"]

        # 100 bytes resume content
        resume_content = b"a" * 100
        
        # Mock process_resume_task in the background to avoid external tasks execution
        with patch("app.routers.application.default_worker_provider") as mock_worker_prov:
            mock_worker = mock_worker_prov.return_value
            mock_worker.process_resume_task = AsyncMock()
            response = await client.post(
                f"/applications/{interview_id}",
                headers={"Authorization": f"Bearer {token}"},
                files={"resume": ("resume.pdf", resume_content, "application/pdf")}
            )
            assert response.status_code == 201
            assert response.json()["status"] == "applied"
            mock_worker.process_resume_task.assert_called_once()

    async def test_apply_exceeds_size_limit(self, client: AsyncClient) -> None:
        """Uploading a file exceeding the configured MAX_UPLOAD_SIZE limit must return 400 Bad Request."""
        org_data, candidate_data, interview_id = await self._setup_users_and_interview(client)
        token = candidate_data["token"]

        # Temporarily mock Settings.MAX_UPLOAD_SIZE to a very small size (10 bytes) for testing
        with patch.object(settings, "MAX_UPLOAD_SIZE", 10):
            # 50 bytes exceeds the 10 bytes limit
            resume_content = b"a" * 50
            response = await client.post(
                f"/applications/{interview_id}",
                headers={"Authorization": f"Bearer {token}"},
                files={"resume": ("large_resume.pdf", resume_content, "application/pdf")}
            )
            assert response.status_code == 400
            assert "File size exceeds the maximum allowed limit" in response.json()["detail"]

    async def test_apply_with_exact_limit(self, client: AsyncClient) -> None:
        """Uploading a file with exact size as the configured MAX_UPLOAD_SIZE limit must succeed."""
        org_data, candidate_data, interview_id = await self._setup_users_and_interview(client)
        token = candidate_data["token"]

        with patch.object(settings, "MAX_UPLOAD_SIZE", 20):
            resume_content = b"a" * 20
            with patch("app.routers.application.default_worker_provider") as mock_worker_prov:
                mock_worker = mock_worker_prov.return_value
                mock_worker.process_resume_task = AsyncMock()
                response = await client.post(
                    f"/applications/{interview_id}",
                    headers={"Authorization": f"Bearer {token}"},
                    files={"resume": ("limit_resume.pdf", resume_content, "application/pdf")}
                )
                assert response.status_code == 201

    async def test_apply_org_fails(self, client: AsyncClient) -> None:
        """Organizations must be rejected when trying to apply for interviews (403 Forbidden)."""
        org_data, candidate_data, interview_id = await self._setup_users_and_interview(client)
        org_token = org_data["access_token"]

        resume_content = b"a" * 100
        response = await client.post(
            f"/applications/{interview_id}",
            headers={"Authorization": f"Bearer {org_token}"},
            files={"resume": ("resume.pdf", resume_content, "application/pdf")}
        )
        assert response.status_code == 403
        assert "Organizations cannot apply for interviews" in response.json()["detail"]

    async def test_apply_not_found(self, client: AsyncClient) -> None:
        """Applying for a non-existent interview must return 404 Not Found."""
        org_data, candidate_data, _ = await self._setup_users_and_interview(client)
        token = candidate_data["token"]

        resume_content = b"a" * 100
        response = await client.post(
            "/applications/999999",
            headers={"Authorization": f"Bearer {token}"},
            files={"resume": ("resume.pdf", resume_content, "application/pdf")}
        )
        assert response.status_code == 404
        assert "Interview not found" in response.json()["detail"]

    async def test_apply_duplicate_fails(self, client: AsyncClient) -> None:
        """Applying for the same interview twice must be rejected with 400 Bad Request."""
        org_data, candidate_data, interview_id = await self._setup_users_and_interview(client)
        token = candidate_data["token"]

        resume_content = b"a" * 100
        with patch("app.routers.application.default_worker_provider") as mock_worker_prov:
            mock_worker = mock_worker_prov.return_value
            mock_worker.process_resume_task = AsyncMock()
            response1 = await client.post(
                f"/applications/{interview_id}",
                headers={"Authorization": f"Bearer {token}"},
                files={"resume": ("resume.pdf", resume_content, "application/pdf")}
            )
            assert response1.status_code == 201

            response2 = await client.post(
                f"/applications/{interview_id}",
                headers={"Authorization": f"Bearer {token}"},
                files={"resume": ("resume.pdf", resume_content, "application/pdf")}
            )
            assert response2.status_code == 400
            assert "You have already applied for this interview" in response2.json()["detail"]
