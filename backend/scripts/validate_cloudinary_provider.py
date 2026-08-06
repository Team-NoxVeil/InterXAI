"""Validate CloudinaryStorageProvider behavior without live credentials.

Runs the upload/delete/download flows against mocked Cloudinary SDK calls and
verifies the error contract (StorageUploadError / StorageDeleteError /
StorageDownloadError) when the SDK fails. Exits non-zero on any failure.

Usage:
    uv run python scripts/validate_cloudinary_provider.py
"""

import asyncio
import sys
import typing
import unittest.mock as mock
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import cloudinary
import cloudinary.exceptions
from cloudinary.utils import cloudinary_url

from app.exceptions.storage import (
    StorageDeleteError,
    StorageDownloadError,
    StorageUploadError,
)
from app.utils.cloudinary_provider import CloudinaryStorageProvider


def assert_raises(
    exc_type: type[Exception],
    fn: typing.Callable[..., typing.Awaitable[object]],
    *args: object,
    **kwargs: object,
) -> None:
    try:
        asyncio.get_event_loop().run_until_complete(fn(*args, **kwargs))
    except exc_type:
        return
    raise AssertionError(f"expected {exc_type.__name__} to be raised")


async def run() -> None:
    provider = CloudinaryStorageProvider(
        cloud_name="demo", api_key="key", api_secret="secret", folder="resumes"
    )

    url, _ = cloudinary_url("resumes/paper.pdf", format="pdf", resource_type="raw", secure=True)

    with mock.patch.object(
        cloudinary.uploader,
        "upload",
        return_value={"public_id": "resumes/paper.pdf", "format": "pdf"},
    ) as upload:
        result = await provider.upload(b"pdf-bytes", "paper.pdf")
        assert result == url, f"unexpected upload URL: {result}"
        upload.assert_called_once()
        print("PASS: upload returns secure Cloudinary URL")

    with mock.patch.object(cloudinary.uploader, "upload", side_effect=Exception("boom")):
        assert_raises(StorageUploadError, provider.upload, b"x", "paper.pdf")
        print("PASS: upload failure raises StorageUploadError")

    with mock.patch.object(cloudinary.api, "delete_resources", return_value=None) as delete:
        await provider.delete("paper.pdf")
        delete.assert_called_once()
        print("PASS: delete calls delete_resources for the public id")

    with mock.patch.object(cloudinary.api, "delete_resources", side_effect=Exception("boom")):
        assert_raises(StorageDeleteError, provider.delete, "paper.pdf")
        print("PASS: delete failure raises StorageDeleteError")

    resource = {"secure_url": "https://res.cloudinary.com/demo/raw/upload/resumes/paper.pdf"}
    with mock.patch.object(cloudinary.api, "resource", return_value=resource):
        data = await provider.download("paper.pdf")
        assert data == b"pdf-bytes", "unexpected download payload"
        print("PASS: download fetches the secure URL bytes")

    with mock.patch.object(
        cloudinary.api, "resource", side_effect=cloudinary.exceptions.NotFound("missing")
    ):
        assert_raises(StorageDownloadError, provider.download, "paper.pdf")
        print("PASS: download failure raises StorageDownloadError")


def main() -> int:
    try:
        asyncio.run(run())
    except AssertionError as e:
        print(f"FAIL: {e}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
