import asyncio
import contextlib
import os
import urllib.request

from app.config import settings
from app.utils import cloudinary_provider
from app.utils.cloudinary_provider import CloudinaryStorageProvider
from app.utils.default_providers import default_storage_provider


class FakeUrlResponse:
    def __init__(self, payload: bytes):
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, traceback):
        return False

    def read(self) -> bytes:
        return self.payload


@contextlib.contextmanager
def patched_cloudinary_calls():
    calls = {"upload": [], "destroy": [], "resource": [], "urlopen": []}
    original_upload = cloudinary_provider.uploader.upload
    original_destroy = cloudinary_provider.uploader.destroy
    original_resource = cloudinary_provider.api.resource
    original_urlopen = urllib.request.urlopen

    def fake_upload(file_buffer, **kwargs):
        calls["upload"].append(
            {
                "public_id": kwargs["public_id"],
                "resource_type": kwargs["resource_type"],
                "overwrite": kwargs["overwrite"],
                "unique_filename": kwargs["unique_filename"],
                "payload": file_buffer.read(),
            }
        )
        return {"secure_url": f"https://cdn.example.com/{kwargs['public_id']}"}

    def fake_destroy(public_id, **kwargs):
        calls["destroy"].append(
            {
                "public_id": public_id,
                "resource_type": kwargs["resource_type"],
                "invalidate": kwargs["invalidate"],
            }
        )
        return {"result": "ok"}

    def fake_resource(public_id, **kwargs):
        calls["resource"].append(
            {
                "public_id": public_id,
                "resource_type": kwargs["resource_type"],
            }
        )
        return {"secure_url": f"https://cdn.example.com/{public_id}"}

    def fake_urlopen(url, timeout):
        calls["urlopen"].append({"url": url, "timeout": timeout})
        return FakeUrlResponse(b"validated-download")

    cloudinary_provider.uploader.upload = fake_upload
    cloudinary_provider.uploader.destroy = fake_destroy
    cloudinary_provider.api.resource = fake_resource
    urllib.request.urlopen = fake_urlopen
    try:
        yield calls
    finally:
        cloudinary_provider.uploader.upload = original_upload
        cloudinary_provider.uploader.destroy = original_destroy
        cloudinary_provider.api.resource = original_resource
        urllib.request.urlopen = original_urlopen


async def main() -> None:
    original_provider = settings.STORAGE_PROVIDER
    original_cloud_name = settings.CLOUDINARY_CLOUD_NAME
    original_api_key = settings.CLOUDINARY_API_KEY
    original_api_secret = settings.CLOUDINARY_API_SECRET
    original_folder = settings.CLOUDINARY_FOLDER

    settings.STORAGE_PROVIDER = "cloudinary"
    settings.CLOUDINARY_CLOUD_NAME = "demo-cloud"
    settings.CLOUDINARY_API_KEY = "demo-key"
    settings.CLOUDINARY_API_SECRET = "demo-secret"
    settings.CLOUDINARY_FOLDER = "validation"

    try:
        selected_provider = default_storage_provider()
        assert isinstance(selected_provider, CloudinaryStorageProvider)

        with patched_cloudinary_calls() as calls:
            provider = CloudinaryStorageProvider(
                cloud_name="demo-cloud",
                api_key="demo-key",
                api_secret="demo-secret",
                folder="validation",
            )

            public_url = await provider.upload(b"resume-bytes", "candidate.pdf")
            await provider.delete("candidate.pdf")
            downloaded = await provider.download("candidate.pdf")

        assert public_url == "https://cdn.example.com/validation/candidate.pdf"
        assert downloaded == b"validated-download"
        assert calls["upload"] == [
            {
                "public_id": "validation/candidate.pdf",
                "resource_type": "raw",
                "overwrite": True,
                "unique_filename": False,
                "payload": b"resume-bytes",
            }
        ]
        assert calls["destroy"] == [
            {
                "public_id": "validation/candidate.pdf",
                "resource_type": "raw",
                "invalidate": True,
            }
        ]
        assert calls["resource"] == [
            {
                "public_id": "validation/candidate.pdf",
                "resource_type": "raw",
            }
        ]
        assert calls["urlopen"] == [
            {
                "url": "https://cdn.example.com/validation/candidate.pdf",
                "timeout": 30,
            }
        ]

        try:
            selected_provider._public_id("   ")
        except ValueError:
            pass
        else:
            raise AssertionError("blank file names must be rejected")

        print("Cloudinary provider validation passed")
        print("- default provider selection returns CloudinaryStorageProvider")
        print("- upload uses raw resource type and deterministic public_id")
        print("- delete invalidates the same public_id")
        print("- download resolves and reads the Cloudinary raw resource URL")
        print("- blank file names are rejected")
    finally:
        settings.STORAGE_PROVIDER = original_provider
        settings.CLOUDINARY_CLOUD_NAME = original_cloud_name
        settings.CLOUDINARY_API_KEY = original_api_key
        settings.CLOUDINARY_API_SECRET = original_api_secret
        settings.CLOUDINARY_FOLDER = original_folder


if __name__ == "__main__":
    os.environ.setdefault("STORAGE_PROVIDER", "cloudinary")
    asyncio.run(main())
