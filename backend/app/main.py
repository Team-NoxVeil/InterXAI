from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.background.taskiq.worker import worker
from app.config import settings
from app.exceptions.auth import register_auth_exception_handlers
from app.exceptions.common import register_common_exception_handlers
from app.exceptions.sql_alchemy import register_sql_alchemy_exception_handlers
from app.logger import get_logger
from app.models.application import Application, InterviewSession
from app.models.interaction import (
    DsaInteraction,
    FollowUpQuestion,
    Interaction,
    ResumeConversation,
    ResumeQuestion,
)
from app.models.interview import CustomInterview, CustomQuestion, DsaTopic
from app.models.organization import Organization
from app.models.user import User, UserProfile
from app.routers.application import router as application_router
from app.routers.interview import router as interview_router
from app.routers.organization import router as organization_router
from app.routers.user import router as user_router

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[None, None]:
    await worker.startup()
    yield
    await worker.shutdown()


app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG, lifespan=lifespan)
register_auth_exception_handlers(app)
register_common_exception_handlers(app)
register_sql_alchemy_exception_handlers(app)

app.include_router(user_router)
app.include_router(organization_router)
app.include_router(interview_router)
app.include_router(application_router)

logger.info("Application initialized: %s", settings.APP_NAME)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy", "app": settings.APP_NAME, "version": "0.1.0"}
