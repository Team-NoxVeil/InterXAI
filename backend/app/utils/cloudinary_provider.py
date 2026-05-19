import asyncio
import io
import urllib.request
from typing import Any, cast

from cloudinary import api, config, uploader
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
    def __init__(
        self,
        cloud_name: str = settings.CLOUDINARY_CLOUD_NAME,
        api_key: str = settings.CLOUDINARY_API_KEY,
        api_secret: str = settings.CLOUDINARY_API_SECRET,
        folder: str = settings.CLOUDINARY_FOLDER,
    ):
        missing = [
            name
            for name, value in {
                "CLOUDINARY_CLOUD_NAME": cloud_name,
                "CLOUDINARY_API_KEY": api_key,
                "CLOUDINARY_API_SECRET": api_secret,
            }.items()
            if not value
        ]
        if missing:
            logger.warning(
                "Cloudinary settings missing: %s. Storage operations may fail.",
                ", ".join(missing),
            )

        self.folder = folder.strip("/")
        config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True,
        )

    def _public_id(self, file_name: str) -> str:
        normalized_name = file_name.strip().lstrip("/")
        if not normalized_name:
            raise ValueError("file_name must not be empty")
        if self.folder:
            return f"{self.folder}/{normalized_name}"
        return normalized_name

    async def upload(self, file: bytes, file_name: str) -> str:
        public_id = self._public_id(file_name)

        def upload_file() -> dict[str, Any]:
            file_buffer = io.BytesIO(file)
            file_buffer.name = file_name
            return cast(
                dict[str, Any],
                uploader.upload(
                    file_buffer,
                    public_id=public_id,
                    resource_type="raw",
                    overwrite=True,
                    unique_filename=False,
                ),
            )

        try:
            response = await asyncio.to_thread(upload_file)
            public_url = response.get("secure_url") or response.get("url")
            if not public_url:
                raise StorageUploadError("Cloudinary upload did not return a public URL")
            return str(public_url)
        except StorageUploadError:
            raise
        except Exception as e:
            logger.error("Cloudinary upload failed: %s", str(e), exc_info=True)
            raise StorageUploadError(f"Failed to upload file to Cloudinary: {str(e)}") from e

    async def delete(self, file_name: str) -> None:
        public_id = self._public_id(file_name)

        try:
            response = await asyncio.to_thread(
                uploader.destroy,
                public_id,
                resource_type="raw",
                invalidate=True,
            )
            result = response.get("result") if isinstance(response, dict) else None
            if result not in {"ok", "not found"}:
                raise StorageDeleteError(f"Cloudinary delete returned unexpected result: {result}")
        except StorageDeleteError:
            raise
        except Exception as e:
            logger.error("Cloudinary delete failed: %s", str(e), exc_info=True)
            raise StorageDeleteError(f"Failed to delete file from Cloudinary: {str(e)}") from e

    async def download(self, file_name: str) -> bytes:
        public_id = self._public_id(file_name)

        def download_file() -> bytes:
            resource = api.resource(public_id, resource_type="raw")
            resource_url = resource.get("secure_url") or resource.get("url")
            if not resource_url:
                resource_url, _ = cloudinary_url(public_id, resource_type="raw", secure=True)
            with urllib.request.urlopen(resource_url, timeout=30) as response:
                return cast(bytes, response.read())

        try:
            return await asyncio.to_thread(download_file)
        except Exception as e:
            logger.error("Cloudinary download failed: %s", str(e), exc_info=True)
            raise StorageDownloadError(f"Failed to download file from Cloudinary: {str(e)}") from e
