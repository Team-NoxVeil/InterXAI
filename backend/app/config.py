from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "InterXAI"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./dev.db"

    # Security
    SECRET_KEY: str = "secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30000

    # Redis/Celery
    REDIS_URL: str = "redis://localhost:6379/0"

    # LLM
    LLM_MODEL_NAME: str = "groq/openai/gpt-oss-120b"
    GROQ_API_KEY: str = ""
    LLM_PROVIDER: str = "litellm"
    FALLBACK_LLM_PROVIDER: str = "gemini/gemini-2.5-flash"
    LITELLM_API_KEY: str = ""

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_BUCKET_NAME: str = "resumes"

    # Providers
    STORAGE_PROVIDER: str = "supabase"
    BACKGROUND_WORKER: str = "taskiq"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings: Settings = Settings()
