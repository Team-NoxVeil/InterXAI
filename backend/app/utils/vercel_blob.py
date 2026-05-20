import asyncio
from typing import cast

import httpx
from vercel_blob import delete, put

from app.exceptions.storage import (
    StorageDeleteError,
    StorageDownloadError,
    StorageUploadError,
)
from app.interfaces.storage_proivder import StorageProviderInterface
from app.logger import get_logger

logger = get_logger(__name__)


class VercelBlobStorageProvider(StorageProviderInterface):
    async def upload(self, file: bytes, file_name: str) -> str:
        try:
            response = await asyncio.to_thread(
                put,
                file_name,
                file,
                {
                    "access": "public",
                },
            )

            return cast(str, response["url"])

        except Exception as e:
            logger.error(
                "Vercel upload failed: %s",
                str(e),
                exc_info=True,
            )
            raise StorageUploadError(f"Failed to upload file to storage: {str(e)}") from e

    async def delete(self, file_name: str) -> None:
        try:
            await asyncio.to_thread(delete, file_name)

        except Exception as e:
            logger.error(
                "Vercel delete failed: %s",
                str(e),
                exc_info=True,
            )
            raise StorageDeleteError(f"Failed to delete file from storage: {str(e)}") from e

    async def download(self, file_name: str) -> bytes:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(file_name)

                response.raise_for_status()

                return response.content

        except Exception as e:
            logger.error(
                "Vercel download failed: %s",
                str(e),
                exc_info=True,
            )
            raise StorageDownloadError(f"Failed to download file from storage: {str(e)}") from e
