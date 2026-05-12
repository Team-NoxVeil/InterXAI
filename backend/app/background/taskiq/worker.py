import base64

from sqlalchemy import select

from app.ai.lite_llm import LiteLLMProvider
from app.ai.resume_evaluator import ResumeEvaluator
from app.ai.schema import ResumeEvaluatorRequest
from app.background.taskiq.taskiq import broker
from app.database import AsyncSessionLocal
from app.interfaces.background_worker import BackgroundWorkerInterface
from app.logger import get_logger
from app.models.application import Application
from app.models.interview import CustomInterview
from app.utils.pdf import extract_pdf_content
from app.utils.supabase_provider import SupabaseStorageProvider

logger = get_logger(__name__)


class TaskiqWorker(BackgroundWorkerInterface):

    @broker.task
    async def process_resume_task(
        file_bytes_b64: str, file_name: str, application_id: int
    ) -> None:
        logger.info("Received resume processing job for application %d", application_id)

        file_bytes = base64.b64decode(file_bytes_b64)
        provider = SupabaseStorageProvider()

        async with AsyncSessionLocal() as session:
            app_to_update = await session.get(Application, application_id)
            if not app_to_update:
                logger.error("Application %d not found in DB.", application_id)
                return

            try:
                public_url = await provider.upload(file_bytes, file_name)
                logger.info(
                    "Successfully uploaded %s to Supabase. URL: %s", file_name, public_url
                )

                interview_result = await session.execute(
                    select(CustomInterview).where(
                        CustomInterview.id == app_to_update.interview_id
                    )
                )
                interview = interview_result.scalar_one_or_none()
                if not interview:
                    raise ValueError(
                        f"Interview not found for application {application_id}."
                    )

                extracted_text = extract_pdf_content(file_bytes)
                evaluator = ResumeEvaluator(llm_provider=LiteLLMProvider())

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
                logger.exception(
                    "[%s] Failed to process resume for application %d. Deleting application.",
                    type(e).__name__,
                    application_id,
                )
                await session.delete(app_to_update)
                await session.commit()
                raise e


worker = TaskiqWorker()
