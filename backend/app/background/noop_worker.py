"""No-op background worker for local development without Redis."""

from app.interfaces.background_worker import BackgroundWorkerInterface
from app.logger import get_logger

logger = get_logger(__name__)


class NoopWorker(BackgroundWorkerInterface):
    async def startup(self) -> None:
        logger.info("NoopWorker started (no Redis required)")

    async def shutdown(self) -> None:
        logger.info("NoopWorker shut down")

    async def process_resume_task(
        self, _file_bytes_b64: str, file_name: str, application_id: int
    ) -> None:
        logger.warning(
            "NoopWorker: process_resume_task called but ignored "
            "(application_id=%d, file=%s)",
            application_id,
            file_name,
        )


noop_worker = NoopWorker()
