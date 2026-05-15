from app.config import settings
from app.interfaces.background_worker import BackgroundWorkerInterface
from app.interfaces.storage_proivder import StorageProviderInterface


def default_storage_provider() -> StorageProviderInterface:
    if settings.STORAGE_PROVIDER == "supabase":
        from app.utils.supabase_provider import SupabaseStorageProvider

        return SupabaseStorageProvider()

    raise ValueError(f"Unknown storage provider: '{settings.STORAGE_PROVIDER}'")


def default_worker_provider() -> BackgroundWorkerInterface:
    # In DEBUG mode we skip starting the TaskIQ worker to avoid external dependencies.
    if settings.DEBUG:
        class DummyWorker:
            async def startup(self):
                return None

            async def shutdown(self):
                return None

        return DummyWorker()
    if settings.BACKGROUND_WORKER == "taskiq":
        from app.background.taskiq.worker import worker
        return worker
    raise ValueError(f"Unknown background worker: '{settings.BACKGROUND_WORKER}'")
