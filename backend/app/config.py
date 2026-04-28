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

    class Config:
        env_file = ".env"
        case_sensitive = True


settings: Settings = Settings()
