from fastapi import FastAPI

from app.config import settings
from app.exceptions.auth import register_auth_exception_handlers
from app.exceptions.common import register_common_exception_handlers
from app.exceptions.sql_alchemy import register_sql_alchemy_exception_handlers
from app.logger import get_logger
from app.routers.user import router as user_router

logger = get_logger(__name__)

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

register_auth_exception_handlers(app)
register_common_exception_handlers(app)
register_sql_alchemy_exception_handlers(app)

app.include_router(user_router)

logger.info("Application initialized: %s", settings.APP_NAME)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy", "app": settings.APP_NAME, "version": "0.1.0"}
