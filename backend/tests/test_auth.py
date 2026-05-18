from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_app_runs() -> None:
    response = client.get("/google/login")
    assert response.status_code != 500


def test_google_callback_exists() -> None:
    response = client.get("/google/callback")
    assert response.status_code != 500
