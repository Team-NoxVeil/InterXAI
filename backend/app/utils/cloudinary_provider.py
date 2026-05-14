import cloudinary
import cloudinary.api
import cloudinary.uploader
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
    """Cloudinary-based storage provider for file upload, download, and deletion.

    This provider uses Cloudinary's upload API to store files and provides
    public URL access via Cloudinary's CDN. It follows the StorageProviderInterface
    contract for seamless integration with the existing storage abstraction.

    Required environment variables:
        - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
        - CLOUDINARY_API_KEY: Your Cloudinary API key
        - CLOUDINARY_API_SECRET: Your Cloudinary API secret
        - CLOUDINARY_FOLDER: (optional) Folder path for uploads (default: "interxai/resumes")
    """

    def __init__(
        self,
        cloud_name: str = settings.CLOUDINARY_CLOUD_NAME,
        api_key: str = settings.CLOUDINARY_API_KEY,
        api_secret: str = settings.CLOUDINARY_API_SECRET,
        folder: str = settings.CLOUDINARY_FOLDER,
    ):
        if not cloud_name or not api_key or not api_secret:
            logger.warning(
                "Cloudinary credentials are not fully configured. "
                "Storage operations may fail."
            )
        self.cloud_name = cloud_name
        self.api_key = api_key
        self.api_secret = api_secret
        self.folder = folder
        self._configure()

    def _configure(self) -> None:
        """Configure the Cloudinary SDK with account credentials."""
        cloudinary.config(
            cloud_name=self.cloud_name,
            api_key=self.api_key,
            api_secret=self.api_secret,
            secure=True,
        )

    def _build_public_id(self, file_name: str) -> str:
        """Build a unique public_id for Cloudinary from the file name.

        Args:
            file_name: The original file name.

        Returns:
            A folder-prefixed public_id suitable for Cloudinary.
        """
        return f"{self.folder}/{file_name}" if self.folder else file_name

    async def upload(self, file: bytes, file_name: str) -> str:
        """Upload a file to Cloudinary storage.

        Args:
            file: The raw bytes of the file to upload.
            file_name: The desired file name (used as public_id base).

        Returns:
            The secure public URL of the uploaded file.

        Raises:
            StorageUploadError: If the upload fails for any reason.
        """
        try:
            public_id = self._build_public_id(file_name)
            result = cloudinary.uploader.upload(
                file,
                public_id=public_id,
                resource_type="auto",
                overwrite=True,
            )
            secure_url: str = result["secure_url"]
            logger.info(
                "Cloudinary upload successful: %s",
                secure_url,
            )
            return secure_url
        except Exception as e:
            logger.error(
                "Cloudinary upload failed for '%s': %s",
                file_name,
                str(e),
                exc_info=True,
            )
            raise StorageUploadError(
                f"Failed to upload file to Cloudinary: {str(e)}"
            ) from e

    async def delete(self, file_name: str) -> None:
        """Delete a file from Cloudinary storage.

        Args:
            file_name: The file name (public_id) to delete.

        Raises:
            StorageDeleteError: If the deletion fails for any reason.
        """
        try:
            public_id = self._build_public_id(file_name)
            result = cloudinary.uploader.destroy(public_id)
            if result.get("result") != "ok":
                logger.warning(
                    "Cloudinary delete returned non-ok result for '%s': %s",
                    file_name,
                    result,
                )
            else:
                logger.info(
                    "Cloudinary delete successful for: %s",
                    file_name,
                )
        except Exception as e:
            logger.error(
                "Cloudinary delete failed for '%s': %s",
                file_name,
                str(e),
                exc_info=True,
            )
            raise StorageDeleteError(
                f"Failed to delete file from Cloudinary: {str(e)}"
            ) from e

    async def download(self, file_name: str) -> bytes:
        """Download a file from Cloudinary storage.

        Args:
            file_name: The file name (public_id) to download.

        Returns:
            The raw bytes of the downloaded file.

        Raises:
            StorageDownloadError: If the download fails for any reason.
        """
        import urllib.request

        try:
            public_id = self._build_public_id(file_name)
            url, _ = cloudinary_url(
                public_id,
                resource_type="raw",
            )
            # Fallback to auto resource type if raw fails
            if not url:
                url, _ = cloudinary_url(
                    public_id,
                    resource_type="auto",
                )

            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=30) as response:
                data: bytes = response.read()
                logger.info(
                    "Cloudinary download successful for: %s (%d bytes)",
                    file_name,
                    len(data),
                )
                return data
        except Exception as e:
            logger.error(
                "Cloudinary download failed for '%s': %s",
                file_name,
                str(e),
                exc_info=True,
            )
            raise StorageDownloadError(
                f"Failed to download file from Cloudinary: {str(e)}"
            ) from e
