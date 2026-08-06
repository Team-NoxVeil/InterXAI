import asyncio

import cloudinary.api
import cloudinary.exceptions
import cloudinary.uploader
from cloudinary import config as cloudinary_config
from cloudinary.utils import cloudinary_url

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
    RESOURCE_TYPE = "raw"

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
        cloudinary_config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True,
        )
        self.folder = folder

    def _public_id(self, file_name: str) -> str:
        return f"{self.folder}/{file_name}"

    async def upload(self, file: bytes, file_name: str) -> str:
        try:
            resource = await asyncio.to_thread(
                cloudinary.uploader.upload,
                file,
                public_id=self._public_id(file_name),
                resource_type=self.RESOURCE_TYPE,
                overwrite=True,
            )
            url, _ = cloudinary_url(
                resource["public_id"],
                format=resource.get("format"),
                resource_type=self.RESOURCE_TYPE,
                secure=True,
            )
            return str(url)
        except Exception as e:
            logger.error("Cloudinary upload failed: %s", str(e), exc_info=True)
            raise StorageUploadError(f"Failed to upload file to storage: {str(e)}") from e

    async def delete(self, file_name: str) -> None:
        try:
            await asyncio.to_thread(
                cloudinary.api.delete_resources,
                [self._public_id(file_name)],
                resource_type=self.RESOURCE_TYPE,
            )
        except Exception as e:
            logger.error("Cloudinary delete failed: %s", str(e), exc_info=True)
            raise StorageDeleteError(f"Failed to delete file from storage: {str(e)}") from e

    async def download(self, file_name: str) -> bytes:
        try:
            resource = await asyncio.to_thread(
                cloudinary.api.resource,
                self._public_id(file_name),
                resource_type=self.RESOURCE_TYPE,
            )
            import httpx

            async with httpx.AsyncClient() as client:
                response = await client.get(resource["secure_url"])
                response.raise_for_status()
                return response.content
        except cloudinary.exceptions.Error as e:
            logger.error("Cloudinary download failed: %s", str(e), exc_info=True)
            raise StorageDownloadError(f"Failed to download file from storage: {str(e)}") from e
        except Exception as e:
            logger.error("Cloudinary download failed: %s", str(e), exc_info=True)
            raise StorageDownloadError(f"Failed to download file from storage: {str(e)}") from e
