from asyncio import to_thread
from io import BytesIO

import cloudinary
import cloudinary.uploader
import cloudinary.utils
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


class CloudinaryStorageProvider(StorageProviderInterface):
    def __init__(
        self,
        cloud_name: str = settings.CLOUDINARY_CLOUD_NAME,
        api_key: str = settings.CLOUDINARY_API_KEY,
        api_secret: str = settings.CLOUDINARY_API_SECRET,
        folder: str = settings.CLOUDINARY_FOLDER,
    ):
        if not cloud_name or not api_key or not api_secret:
            logger.warning(
                "Cloudinary credentials are not configured. Storage operations may fail."
            )

        self.folder = folder.strip("/")
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True,
        )

    def _public_id(self, file_name: str) -> str:
        return f"{self.folder}/{file_name}" if self.folder else file_name

    async def upload(self, file: bytes, file_name: str) -> str:
        try:
            result = await to_thread(
                cloudinary.uploader.upload,
                BytesIO(file),
                public_id=self._public_id(file_name),
                resource_type="raw",
                overwrite=True,
            )
            url = result.get("secure_url") or result.get("url")
            if not isinstance(url, str) or not url:
                raise StorageUploadError("Cloudinary upload response did not include a URL")
            return url
        except StorageUploadError:
            raise
        except Exception as e:
            logger.error("Cloudinary upload failed: %s", str(e), exc_info=True)
            raise StorageUploadError(f"Failed to upload file to storage: {str(e)}") from e

    async def delete(self, file_name: str) -> None:
        try:
            result = await to_thread(
                cloudinary.uploader.destroy,
                self._public_id(file_name),
                resource_type="raw",
            )
            if result.get("result") not in {"ok", "not found"}:
                raise StorageDeleteError(f"Cloudinary delete failed: {result}")
        except StorageDeleteError:
            raise
        except Exception as e:
            logger.error("Cloudinary delete failed: %s", str(e), exc_info=True)
            raise StorageDeleteError(f"Failed to delete file from storage: {str(e)}") from e

    async def download(self, file_name: str) -> bytes:
        try:
            url, _ = cloudinary.utils.cloudinary_url(
                self._public_id(file_name),
                resource_type="raw",
                secure=True,
            )
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                response.raise_for_status()
                return response.content
        except Exception as e:
            logger.error("Cloudinary download failed: %s", str(e), exc_info=True)
            raise StorageDownloadError(f"Failed to download file from storage: {str(e)}") from e
