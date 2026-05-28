from typing import Any

import pytest

from app.exceptions.storage import StorageDeleteError, StorageDownloadError, StorageUploadError
from app.utils.cloudinary_provider import CloudinaryStorageProvider


class _FakeResponse:
    def __init__(self, content: bytes = b"pdf-bytes", should_raise: bool = False):
        self.content = content
        self.should_raise = should_raise

    def raise_for_status(self) -> None:
        if self.should_raise:
            raise RuntimeError("download failed")


class _FakeAsyncClient:
    def __init__(self, response: _FakeResponse):
        self.response = response
        self.requested_url = ""

    async def __aenter__(self) -> "_FakeAsyncClient":
        return self

    async def __aexit__(self, *args: Any) -> None:
        return None

    async def get(self, url: str) -> _FakeResponse:
        self.requested_url = url
        return self.response


@pytest.mark.asyncio
async def test_upload_stores_pdf_as_raw_asset(monkeypatch: pytest.MonkeyPatch) -> None:
    calls: dict[str, Any] = {}

    def fake_upload(file: Any, **kwargs: Any) -> dict[str, str]:
        calls["payload"] = file.read()
        calls["kwargs"] = kwargs
        return {"secure_url": "https://res.cloudinary.com/demo/raw/upload/resumes/resume.pdf"}

    monkeypatch.setattr("app.utils.cloudinary_provider.cloudinary.uploader.upload", fake_upload)

    provider = CloudinaryStorageProvider(
        cloud_name="demo",
        api_key="key",
        api_secret="secret",
        folder="resumes",
    )

    result = await provider.upload(b"%PDF", "resume.pdf")

    assert result == "https://res.cloudinary.com/demo/raw/upload/resumes/resume.pdf"
    assert calls["payload"] == b"%PDF"
    assert calls["kwargs"] == {
        "public_id": "resumes/resume.pdf",
        "resource_type": "raw",
        "overwrite": True,
    }


@pytest.mark.asyncio
async def test_upload_wraps_cloudinary_errors(monkeypatch: pytest.MonkeyPatch) -> None:
    def fake_upload(*_args: Any, **_kwargs: Any) -> dict[str, str]:
        raise RuntimeError("bad credentials")

    monkeypatch.setattr("app.utils.cloudinary_provider.cloudinary.uploader.upload", fake_upload)
    provider = CloudinaryStorageProvider("demo", "key", "secret")

    with pytest.raises(StorageUploadError):
        await provider.upload(b"%PDF", "resume.pdf")


@pytest.mark.asyncio
async def test_delete_removes_raw_asset(monkeypatch: pytest.MonkeyPatch) -> None:
    calls: dict[str, Any] = {}

    def fake_destroy(public_id: str, **kwargs: Any) -> dict[str, str]:
        calls["public_id"] = public_id
        calls["kwargs"] = kwargs
        return {"result": "ok"}

    monkeypatch.setattr("app.utils.cloudinary_provider.cloudinary.uploader.destroy", fake_destroy)
    provider = CloudinaryStorageProvider("demo", "key", "secret", folder="resumes")

    await provider.delete("resume.pdf")

    assert calls == {
        "public_id": "resumes/resume.pdf",
        "kwargs": {"resource_type": "raw"},
    }


@pytest.mark.asyncio
async def test_delete_wraps_failed_result(monkeypatch: pytest.MonkeyPatch) -> None:
    def fake_destroy(*_args: Any, **_kwargs: Any) -> dict[str, str]:
        return {"result": "error"}

    monkeypatch.setattr("app.utils.cloudinary_provider.cloudinary.uploader.destroy", fake_destroy)
    provider = CloudinaryStorageProvider("demo", "key", "secret")

    with pytest.raises(StorageDeleteError):
        await provider.delete("resume.pdf")


@pytest.mark.asyncio
async def test_download_fetches_cloudinary_raw_url(monkeypatch: pytest.MonkeyPatch) -> None:
    fake_client = _FakeAsyncClient(_FakeResponse(content=b"%PDF"))

    def fake_cloudinary_url(public_id: str, **kwargs: Any) -> tuple[str, dict[str, Any]]:
        assert public_id == "resumes/resume.pdf"
        assert kwargs == {"resource_type": "raw", "secure": True}
        return "https://res.cloudinary.com/demo/raw/upload/resumes/resume.pdf", {}

    monkeypatch.setattr("app.utils.cloudinary_provider.cloudinary.utils.cloudinary_url", fake_cloudinary_url)
    monkeypatch.setattr("app.utils.cloudinary_provider.httpx.AsyncClient", lambda: fake_client)
    provider = CloudinaryStorageProvider("demo", "key", "secret", folder="resumes")

    result = await provider.download("resume.pdf")

    assert result == b"%PDF"
    assert fake_client.requested_url == "https://res.cloudinary.com/demo/raw/upload/resumes/resume.pdf"


@pytest.mark.asyncio
async def test_download_wraps_http_errors(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "app.utils.cloudinary_provider.cloudinary.utils.cloudinary_url",
        lambda *_args, **_kwargs: ("https://example.test/resume.pdf", {}),
    )
    monkeypatch.setattr(
        "app.utils.cloudinary_provider.httpx.AsyncClient",
        lambda: _FakeAsyncClient(_FakeResponse(should_raise=True)),
    )
    provider = CloudinaryStorageProvider("demo", "key", "secret")

    with pytest.raises(StorageDownloadError):
        await provider.download("resume.pdf")
