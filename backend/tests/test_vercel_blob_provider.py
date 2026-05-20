import asyncio
from unittest.mock import Mock, patch

import pytest

from app.exceptions.storage import (
    StorageDeleteError,
    StorageDownloadError,
    StorageUploadError,
)
from app.utils.vercel_blob import VercelBlobStorageProvider


def test_upload_success() -> None:
    provider = VercelBlobStorageProvider()

    with patch("app.utils.vercel_blob.put") as mock_put:
        mock_put.return_value = {
            "url": "https://example.com/test.pdf",
        }

        result = asyncio.run(
            provider.upload(
                b"test-data",
                "test.pdf",
            )
        )

        assert result == "https://example.com/test.pdf"


def test_upload_failure() -> None:
    provider = VercelBlobStorageProvider()

    with patch("app.utils.vercel_blob.put") as mock_put:
        mock_put.side_effect = Exception("Upload failed")

        with pytest.raises(StorageUploadError):
            asyncio.run(
                provider.upload(
                    b"test-data",
                    "test.pdf",
                )
            )


def test_download_success() -> None:
    provider = VercelBlobStorageProvider()

    mock_response = Mock()
    mock_response.content = b"file-content"
    mock_response.raise_for_status.return_value = None

    with patch(
        "httpx.AsyncClient.get",
        return_value=mock_response,
    ):
        result = asyncio.run(
            provider.download(
                "https://example.com/test.pdf",
            )
        )

        assert result == b"file-content"


def test_download_failure() -> None:
    provider = VercelBlobStorageProvider()

    with (
        patch(
            "httpx.AsyncClient.get",
            side_effect=Exception("Download failed"),
        ),
        pytest.raises(StorageDownloadError),
    ):
        asyncio.run(
            provider.download(
                "https://example.com/test.pdf",
            )
        )


def test_delete_success() -> None:
    provider = VercelBlobStorageProvider()

    with patch("app.utils.vercel_blob.delete") as mock_delete:
        asyncio.run(
            provider.delete(
                "https://example.com/test.pdf",
            )
        )

        mock_delete.assert_called_once()


def test_delete_failure() -> None:
    provider = VercelBlobStorageProvider()

    with (
        patch(
            "app.utils.vercel_blob.delete",
            side_effect=Exception("Delete failed"),
        ),
        pytest.raises(StorageDeleteError),
    ):
        asyncio.run(
            provider.delete(
                "https://example.com/test.pdf",
            )
        )
