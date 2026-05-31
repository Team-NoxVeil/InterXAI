"""
Integration tests for the /health endpoint.

These tests exercise the full FastAPI routing stack against an in-memory
SQLite database (see conftest.py). No external services are required.
"""

from httpx import AsyncClient


class TestHealthEndpoint:
    """Tests for GET /health."""

    async def test_health_returns_200(self, client: AsyncClient) -> None:
        """The /health endpoint must respond with HTTP 200 OK."""
        response = await client.get("/health")
        assert response.status_code == 200

    async def test_health_response_has_status_healthy(self, client: AsyncClient) -> None:
        """The response body must contain {"status": "healthy"}."""
        response = await client.get("/health")
        data = response.json()
        assert data["status"] == "healthy"

    async def test_health_response_has_app_name(self, client: AsyncClient) -> None:
        """The response body must contain the 'app' field."""
        response = await client.get("/health")
        data = response.json()
        assert "app" in data
        assert isinstance(data["app"], str)
        assert len(data["app"]) > 0

    async def test_health_response_has_version(self, client: AsyncClient) -> None:
        """The response body must contain a non-empty 'version' string."""
        response = await client.get("/health")
        data = response.json()
        assert "version" in data
        assert isinstance(data["version"], str)

    async def test_health_content_type_is_json(self, client: AsyncClient) -> None:
        """The response Content-Type must be application/json."""
        response = await client.get("/health")
        assert "application/json" in response.headers.get("content-type", "")

    async def test_health_is_idempotent(self, client: AsyncClient) -> None:
        """Calling /health twice must return the same response."""
        r1 = await client.get("/health")
        r2 = await client.get("/health")
        assert r1.status_code == r2.status_code
        assert r1.json() == r2.json()
