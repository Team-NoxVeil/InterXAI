from unittest.mock import Mock, patch

import pytest

from app.exceptions.storage import (
    StorageDownloadError,
    StorageUploadError,
)
from app.utils.vercel_blob import VercelBlobStorageProvider


@pytest.mark.asyncio
async def test_upload_success() -> None:
    provider = VercelBlobStorageProvider()

    with patch("app.utils.vercel_blob.put") as mock_put:
        mock_put.return_value = {
            "url": "https://example.com/test.pdf",
        }

        result = await provider.upload(
            b"test-data",
            "test.pdf",
        )

        assert result == "https://example.com/test.pdf"


@pytest.mark.asyncio
async def test_upload_failure() -> None:
    provider = VercelBlobStorageProvider()

    with patch("app.utils.vercel_blob.put") as mock_put:
        mock_put.side_effect = Exception("Upload failed")

        with pytest.raises(StorageUploadError):
            await provider.upload(
                b"test-data",
                "test.pdf",
            )


@pytest.mark.asyncio
async def test_download_success() -> None:
    provider = VercelBlobStorageProvider()

    mock_response = Mock()
    mock_response.content = b"file-content"
    mock_response.raise_for_status.return_value = None

    with patch(
        "httpx.AsyncClient.get",
        return_value=mock_response,
    ):
        result = await provider.download(
            "https://example.com/test.pdf",
        )

        assert result == b"file-content"


@pytest.mark.asyncio
async def test_download_failure() -> None:
    provider = VercelBlobStorageProvider()

    with (
        patch(
            "httpx.AsyncClient.get",
            side_effect=Exception("Download failed"),
        ),
        pytest.raises(StorageDownloadError),
    ):
        await provider.download(
            "https://example.com/test.pdf",
        )
