from app.config import settings
from app.interfaces.background_worker import BackgroundWorkerInterface
from app.interfaces.storage_proivder import StorageProviderInterface


def default_storage_provider() -> StorageProviderInterface:
    if settings.STORAGE_PROVIDER == "supabase":
        from app.utils.supabase_provider import SupabaseStorageProvider

        return SupabaseStorageProvider()

    raise ValueError(f"Unknown storage provider: '{settings.STORAGE_PROVIDER}'")


def default_worker_provider() -> BackgroundWorkerInterface:
    if settings.BACKGROUND_WORKER == "taskiq":
        from app.background.taskiq.worker import worker

        return worker

    if settings.BACKGROUND_WORKER == "noop":
        from app.background.noop_worker import noop_worker

        return noop_worker

    raise ValueError(f"Unknown background worker: '{settings.BACKGROUND_WORKER}'")
