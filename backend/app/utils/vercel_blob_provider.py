from urllib.parse import quote

import httpx

from app.config import settings
from app.exceptions.storage import (
    StorageDeleteError,
    StorageDownloadError,
    StorageUploadError,
)
from app.interfaces.storage_proivder import StorageProviderInterface
from app.logger import get_logger

logger = get_logger(__name__)


class VercelBlobStorageProvider(StorageProviderInterface):
    def __init__(
        self,
        token: str = settings.BLOB_READ_WRITE_TOKEN,
        base_url: str = settings.VERCEL_BLOB_API_URL,
    ):
        if not token:
            logger.warning("Vercel Blob token is not configured. Storage operations may fail.")
        self.token = token
        self.base_url = base_url.rstrip("/")

    @property
    def _headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self.token}"}

    async def upload(self, file: bytes, file_name: str) -> str:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.put(
                    f"{self.base_url}/{quote(file_name)}",
                    content=file,
                    headers={**self._headers, "content-type": "application/pdf"},
                )
                response.raise_for_status()
                payload = response.json()
                url = payload.get("url") or payload.get("downloadUrl")
                if not url:
                    raise StorageUploadError("Vercel Blob upload response did not include a URL")
                return url
        except Exception as e:
            logger.error("Vercel Blob upload failed: %s", str(e), exc_info=True)
            raise StorageUploadError(f"Failed to upload file to storage: {str(e)}") from e

    async def delete(self, file_name: str) -> None:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    self.base_url,
                    params={"url": file_name},
                    headers=self._headers,
                )
                response.raise_for_status()
        except Exception as e:
            logger.error("Vercel Blob delete failed: %s", str(e), exc_info=True)
            raise StorageDeleteError(f"Failed to delete file from storage: {str(e)}") from e

    async def download(self, file_name: str) -> bytes:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(file_name, headers=self._headers)
                response.raise_for_status()
                return response.content
        except Exception as e:
            logger.error("Vercel Blob download failed: %s", str(e), exc_info=True)
            raise StorageDownloadError(f"Failed to download file from storage: {str(e)}") from e
