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
    CHATGROQ_API_KEY: str = ""
    CHATGROQ_MODEL_NAME: str = "llama3-8b-8192"
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL_NAME: str = "claude-3-haiku-20240307"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_BUCKET_NAME: str = "resumes"

    # Piston (code execution)
    PISTON_URL: str = "http://localhost:2000"

    # Interview proctoring
    IMMEDIATE_DISQUALIFICATION: bool = False
    HEARTBEAT_THRESHOLD_S: int = 20

    # Providers
    STORAGE_PROVIDER: str = "supabase"
    BACKGROUND_WORKER: str = "taskiq"
    EMAIL_PROVIDER: str = "smtp"

    # SMTP (email)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""  # falls back to SMTP_USERNAME when empty
    SMTP_USE_TLS: bool = True  # STARTTLS, typical on port 587
    SMTP_USE_SSL: bool = False  # implicit SSL, typical on port 465

    OIDC_GOOGLE_CLIENT_ID: str = ""
    OIDC_GOOGLE_CLIENT_SECRET: str = ""
    # Where the OIDC callback redirects the browser back to (the SPA origin).
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings: Settings = Settings()
