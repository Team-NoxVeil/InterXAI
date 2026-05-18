"""
Integration tests for /users/* endpoints (signup, login, get, protected routes).

All tests run against an in-memory SQLite database and the FastAPI app via
ASGI transport (no live server required). Each test class is designed to be
self-contained using unique, deterministic usernames to avoid cross-test
conflicts (since JwtAuth.create_user commits directly to the shared session).
"""

import uuid
from typing import Any, cast

from httpx import AsyncClient

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _unique_user() -> dict[str, Any]:
    """Generate a unique, valid user payload for each test invocation."""
    uid = uuid.uuid4().hex[:8]
    return {
        "username": f"testuser_{uid}",
        "email": f"testuser_{uid}@example.com",
        "password": "SecurePass123!",
    }


async def _signup(client: AsyncClient, payload: dict[str, Any]) -> dict[str, Any]:
    """Register a user and return the parsed JSON response."""
    response = await client.post("/users/signup", json=payload)
    assert response.status_code == 201, response.text
    return cast(dict[str, Any], response.json())


# ---------------------------------------------------------------------------
# Signup tests
# ---------------------------------------------------------------------------


class TestUserSignup:
    """Integration tests for POST /users/signup."""

    async def test_signup_returns_201(self, client: AsyncClient) -> None:
        """A valid signup request must return HTTP 201 Created."""
        payload = _unique_user()
        response = await client.post("/users/signup", json=payload)
        assert response.status_code == 201

    async def test_signup_returns_token(self, client: AsyncClient) -> None:
        """The signup response must contain a non-empty JWT token string."""
        data = await _signup(client, _unique_user())
        assert "token" in data
        assert isinstance(data["token"], str)
        assert len(data["token"]) > 0

    async def test_signup_returns_user_object(self, client: AsyncClient) -> None:
        """The signup response must include a 'user' object with id and username."""
        payload = _unique_user()
        data = await _signup(client, payload)
        assert "user" in data
        user = data["user"]
        assert user["username"] == payload["username"]
        assert user["email"] == payload["email"]
        assert "id" in user

    async def test_signup_duplicate_username_returns_409(self, client: AsyncClient) -> None:
        """Registering the same username twice must return HTTP 409 Conflict."""
        payload = _unique_user()
        await _signup(client, payload)
        # Second registration with the same username.
        response = await client.post("/users/signup", json=payload)
        assert response.status_code == 409

    async def test_signup_duplicate_email_returns_409(self, client: AsyncClient) -> None:
        """Registering the same email with a different username must return HTTP 409."""
        payload = _unique_user()
        await _signup(client, payload)
        # Same email, different username.
        payload2 = {**payload, "username": f"other_{payload['username']}"}
        response = await client.post("/users/signup", json=payload2)
        assert response.status_code == 409

    async def test_signup_missing_fields_returns_422(self, client: AsyncClient) -> None:
        """Omitting required fields must return HTTP 422 Unprocessable Entity."""
        response = await client.post("/users/signup", json={"username": "onlyname"})
        assert response.status_code == 422

    async def test_signup_invalid_email_returns_422(self, client: AsyncClient) -> None:
        """Submitting a non-email string for the email field must return 422."""
        payload = {**_unique_user(), "email": "not-an-email"}
        response = await client.post("/users/signup", json=payload)
        assert response.status_code == 422


# ---------------------------------------------------------------------------
# Login tests
# ---------------------------------------------------------------------------


class TestUserLogin:
    """Integration tests for POST /users/login."""

    async def test_login_returns_200(self, client: AsyncClient) -> None:
        """A valid login request must return HTTP 200 OK."""
        payload = _unique_user()
        await _signup(client, payload)
        response = await client.post(
            "/users/login",
            json={"username": payload["username"], "password": payload["password"]},
        )
        assert response.status_code == 200

    async def test_login_returns_token(self, client: AsyncClient) -> None:
        """A successful login must return a non-empty JWT token."""
        payload = _unique_user()
        await _signup(client, payload)
        response = await client.post(
            "/users/login",
            json={"username": payload["username"], "password": payload["password"]},
        )
        data = response.json()
        assert "token" in data
        assert isinstance(data["token"], str)
        assert len(data["token"]) > 0

    async def test_login_returns_user_object(self, client: AsyncClient) -> None:
        """A successful login response must include the user's basic info."""
        payload = _unique_user()
        signup_data = await _signup(client, payload)
        response = await client.post(
            "/users/login",
            json={"username": payload["username"], "password": payload["password"]},
        )
        login_data = response.json()
        assert login_data["user"]["id"] == signup_data["user"]["id"]
        assert login_data["user"]["username"] == payload["username"]

    async def test_login_wrong_password_returns_401(self, client: AsyncClient) -> None:
        """Providing the wrong password must return HTTP 401 Unauthorized."""
        payload = _unique_user()
        await _signup(client, payload)
        response = await client.post(
            "/users/login",
            json={"username": payload["username"], "password": "WrongPassword!"},
        )
        assert response.status_code == 401

    async def test_login_unknown_username_returns_401(self, client: AsyncClient) -> None:
        """Logging in with a username that doesn't exist must return 401."""
        response = await client.post(
            "/users/login",
            json={"username": "ghost_user_xyz", "password": "anything"},
        )
        assert response.status_code == 401

    async def test_login_missing_fields_returns_422(self, client: AsyncClient) -> None:
        """Omitting the password field must return 422."""
        response = await client.post("/users/login", json={"username": "onlyname"})
        assert response.status_code == 422


# ---------------------------------------------------------------------------
# Get user tests (protected)
# ---------------------------------------------------------------------------


class TestGetUser:
    """Integration tests for GET /users/{user_id}."""

    async def test_get_user_returns_200_with_valid_token(self, client: AsyncClient) -> None:
        """GET /users/{id} must return 200 when a valid Bearer token is provided."""
        payload = _unique_user()
        data = await _signup(client, payload)
        token = data["token"]
        user_id = data["user"]["id"]
        response = await client.get(
            f"/users/{user_id}", headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200

    async def test_get_user_returns_correct_fields(self, client: AsyncClient) -> None:
        """The user response must include id, username, and email."""
        payload = _unique_user()
        data = await _signup(client, payload)
        token = data["token"]
        user_id = data["user"]["id"]
        response = await client.get(
            f"/users/{user_id}", headers={"Authorization": f"Bearer {token}"}
        )
        user = response.json()
        assert user["id"] == user_id
        assert user["username"] == payload["username"]
        assert user["email"] == payload["email"]

    async def test_get_user_without_token_returns_401(self, client: AsyncClient) -> None:
        """GET /users/{id} without an Authorization header must return 401."""
        payload = _unique_user()
        data = await _signup(client, payload)
        user_id = data["user"]["id"]
        response = await client.get(f"/users/{user_id}")
        assert response.status_code == 401

    async def test_get_user_not_found_returns_404(self, client: AsyncClient) -> None:
        """GET /users/{id} for a non-existent user must return 404."""
        payload = _unique_user()
        data = await _signup(client, payload)
        token = data["token"]
        response = await client.get("/users/999999", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 404
