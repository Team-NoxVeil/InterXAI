from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.ai.lite_llm import LiteLLMProvider
from app.ai.resume_question_generator import ResumeQuestionGenerator
from app.ai.schema import ResumeQuestionRequest
from app.background.taskiq.taskiq import broker
from app.database import AsyncSessionLocal
from app.logger import get_logger
from app.models.application import Application, InterviewSession
from app.models.interaction import ResumeConversation, ResumeQuestion

logger = get_logger(__name__)


async def run_generate_resume_questions(session_id: int) -> None:
    """
    For the given interview session, fetch the candidate's extracted resume + the
    interview's role metadata, ask the LLM for 3 resume-grounded question+answer
    pairs, and persist them as one ResumeConversation with 3 ResumeQuestions.

    Skips entirely (no ResumeConversation created) when the interview has
    ask_questions_on_resume=False.

    Each ResumeQuestion.question stores the question text. The expected reference
    answer is stored in ResumeQuestion.answer (will later be compared against the
    candidate's actual answer at evaluation time).
    """
    logger.info("Resume question generation started: session=%d", session_id)

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(InterviewSession)
            .options(selectinload(InterviewSession.application).selectinload(Application.interview))
            .where(InterviewSession.id == session_id)
        )
        session = result.scalar_one_or_none()

        if session is None:
            logger.error("InterviewSession %d not found", session_id)
            return

        application = session.application
        if application is None or not application.extracted_resume:
            logger.error(
                "Session %d has no application or no extracted_resume — cannot generate",
                session_id,
            )
            return

        interview = application.interview
        if interview is None:
            logger.error("Session %d application has no linked interview", session_id)
            return

        if not interview.ask_questions_on_resume:
            logger.info(
                "Interview for session %d has ask_questions_on_resume=False — skipping",
                session_id,
            )
            return

        # Capture the inputs we need before closing the session
        extracted_resume = application.extracted_resume
        job_title = interview.position
        job_description = interview.description
        experience = interview.experience

    generator = ResumeQuestionGenerator(llm_provider=LiteLLMProvider())
    req = ResumeQuestionRequest(
        extracted_standardized_resume=extracted_resume,
        job_title=job_title,
        job_description=job_description,
        experience=experience,
    )

    generated = await generator.generate(req)
    if generated is None:
        logger.error("LLM returned no resume questions for session %d", session_id)
        return

    if len(generated.questions) != 3:
        logger.warning(
            "Expected 3 resume questions for session %d, got %d — saving anyway",
            session_id,
            len(generated.questions),
        )

    async with AsyncSessionLocal() as db:
        conversation = ResumeConversation(session_id=session_id)
        db.add(conversation)
        await db.flush()  # populate conversation.id before linking children

        for qa in generated.questions:
            db.add(
                ResumeQuestion(
                    conversation_id=conversation.id,
                    question=qa.question,
                    answer=qa.expected_answer,
                )
            )

        await db.commit()

    logger.info(
        "Saved resume conversation with %d questions for session %d ✓",
        len(generated.questions),
        session_id,
    )


@broker.task
async def generate_resume_questions_task(session_id: int) -> None:
    """TaskIQ-dispatchable wrapper around run_generate_resume_questions."""
    await run_generate_resume_questions(session_id)
