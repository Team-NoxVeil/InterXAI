from app.config import settings
from app.interfaces.background_worker import BackgroundWorkerInterface
from app.interfaces.llm_provider import LLMProviderInterface
from app.interfaces.email_provider import EmailProvider
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

    raise ValueError(f"Unknown background worker: '{settings.BACKGROUND_WORKER}'")


def default_llm_provider() -> LLMProviderInterface:
    if settings.LLM_PROVIDER == "litellm":
        from app.ai.lite_llm import LiteLLMProvider

        return LiteLLMProvider()

    raise ValueError(f"Unknown LLM provider: '{settings.LLM_PROVIDER}'")


def default_fallback_llm_provider() -> LLMProviderInterface | None:
    if not settings.FALLBACK_LLM_PROVIDER:
        return None

    from app.ai.lite_llm import LiteLLMProvider

    return LiteLLMProvider(
        model_name=settings.FALLBACK_LLM_PROVIDER, api_key=settings.LITELLM_API_KEY
    )
def default_email_provider() -> EmailProvider:
    if settings.EMAIL_PROVIDER == "smtp":
        from app.utils.smtp_provider import SmtpEmailProvider

        return SmtpEmailProvider()

    raise ValueError(f"Unknown email provider: '{settings.EMAIL_PROVIDER}'")
