import asyncio
import base64
import ssl

from celery import Celery
from sqlalchemy import select

from app.ai.lite_llm import LiteLLMProvider
from app.ai.resume_evaluator import ResumeEvaluator
from app.ai.schema import ResumeEvaluatorRequest
from app.config import settings
from app.logger import get_logger
from app.models.application import Application
from app.models.interview import CustomInterview
from app.utils.pdf import extract_pdf_content
from app.utils.supabase_provider import SupabaseStorageProvider

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# Resolve effective broker / backend URLs based on BROKER_TYPE.
# Fallback: when BROKER_URL is empty, use REDIS_URL for backward compat.
# ---------------------------------------------------------------------------
_broker_url: str = settings.BROKER_URL if settings.BROKER_URL else settings.REDIS_URL

if settings.BROKER_TYPE == "rabbitmq":
    # RabbitMQ: use amqp(s):// for the broker; rpc:// for the result backend
    # so that no external store (Redis, DB) is required.
    celery_app = Celery(
        "interxai_worker",
        broker=_broker_url,
        backend="rpc://",
    )
else:
    # Redis (default)
    celery_app = Celery(
        "interxai_worker",
        broker=_broker_url,
        backend=_broker_url,
    )

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Apply transport-specific SSL / TLS settings
if settings.BROKER_TYPE == "rabbitmq" and _broker_url.startswith("amqps://"):
    celery_app.conf.update(
        broker_use_ssl={
            "ssl": True,
            "ssl_cert_reqs": ssl.CERT_NONE,
        },
    )
elif _broker_url.startswith("rediss://"):
    celery_app.conf.update(
        broker_use_ssl={"ssl_cert_reqs": ssl.CERT_NONE},
        redis_backend_use_ssl={"ssl_cert_reqs": ssl.CERT_NONE},
    )


@celery_app.task(name="process_resume_task")
def process_resume_task(file_bytes_b64: str, file_name: str, application_id: int) -> None:
    """
    Background job to process and evaluate a resume.
    """
    logger.info("Received resume processing job for application %d", application_id)
    file_bytes = base64.b64decode(file_bytes_b64)
    provider = SupabaseStorageProvider()

    async def process_and_evaluate() -> None:
        from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

        db_url = settings.DATABASE_URL
        if db_url.startswith("postgresql://"):
            db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

        engine = create_async_engine(db_url, echo=settings.DEBUG, future=True)
        async_session_local_celery = async_sessionmaker(
            bind=engine, expire_on_commit=False, autocommit=False, autoflush=False
        )

        async with async_session_local_celery() as session:
            app_to_update = await session.get(Application, application_id)
            if not app_to_update:
                logger.error("Application %d not found in DB.", application_id)
                return

            try:
                public_url = await provider.upload(file_bytes, file_name)
                logger.info("Successfully uploaded %s to Supabase. URL: %s", file_name, public_url)

                interview_result = await session.execute(
                    select(CustomInterview).where(CustomInterview.id == app_to_update.interview_id)
                )
                interview = interview_result.scalar_one_or_none()
                if not interview:
                    logger.error("Interview not found for application %d.", application_id)
                    return

                llm_provider = LiteLLMProvider()
                evaluator = ResumeEvaluator(llm_provider=llm_provider)

                try:
                    extracted_text = extract_pdf_content(file_bytes)
                except Exception as ext_e:
                    logger.error(
                        "Failed to parse PDF for application %d: %s", application_id, str(ext_e)
                    )
                    raise ext_e

                req = ResumeEvaluatorRequest(
                    resume_text=extracted_text,
                    job_title=interview.position,
                    job_description=interview.description,
                    experience=interview.experience,
                )

                logger.info("Starting resume evaluation for application %d...", application_id)
                res = await evaluator.evaluate(req)

                app_to_update.resume = public_url
                app_to_update.extracted_resume = res.extracted_standardized_resume
                app_to_update.score = res.score
                app_to_update.shortlisting_decision = res.shortlisting_decision
                app_to_update.feedback = res.feedback

                await session.commit()
                logger.info(
                    "Successfully evaluated and saved resume for application %d", application_id
                )

            except Exception as e:
                logger.error(
                    "Failed to process resume for application %d. Deleting application. Error: %s",
                    application_id,
                    str(e),
                )
                await session.delete(app_to_update)
                await session.commit()
                raise e

    asyncio.run(process_and_evaluate())
