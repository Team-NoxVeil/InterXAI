import httpx
from vercel_blob import put

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
            response = put(
                file_name,
                file,
                {
                    "access": "public",
                },
            )

            return response["url"]

        except Exception as e:
            logger.error("Vercel upload failed: %s", str(e), exc_info=True)

            raise StorageUploadError(f"Failed to upload file to storage: {str(e)}") from e

    async def delete(self, _file_name: str) -> None:
        raise StorageDeleteError("Delete operation not implemented for Vercel Blob.")

    async def download(self, file_name: str) -> bytes:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(file_name)

                response.raise_for_status()

                return response.content

        except Exception as e:
            logger.error("Vercel download failed: %s", str(e), exc_info=True)

            raise StorageDownloadError(f"Failed to download file from storage: {str(e)}") from e
