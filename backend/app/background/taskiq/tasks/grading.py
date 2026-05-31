import json
from typing import Any

from sqlalchemy import select

from app.ai.evaluator import Evaluator
from app.ai.final_evaluator import FinalEvaluator
from app.ai.lite_llm import LiteLLMProvider
from app.ai.schema import EvaluationRequest, FinalEvaluationRequest
from app.background.taskiq.taskiq import broker
from app.database import AsyncSessionLocal
from app.logger import get_logger
from app.models.application import Application, InterviewSession
from app.models.interaction import FollowUpQuestion, Interaction
from app.models.interview import CustomInterview, CustomQuestion

logger = get_logger(__name__)


async def run_grade_interaction(interaction_id: int) -> None:
    """
    Evaluate a single Interaction (a QUESTIONS-round conversation: the main
    custom question plus its follow-up turns). Stores the LLM-derived score and
    feedback onto the Interaction so the final evaluator can aggregate later.
    """
    async with AsyncSessionLocal() as db:
        interaction = await db.get(Interaction, interaction_id)
        if interaction is None:
            logger.error("Interaction %d not found", interaction_id)
            return

        custom_q = await db.get(CustomQuestion, interaction.custom_question_id)
        session = await db.get(InterviewSession, interaction.session_id)
        if custom_q is None or session is None:
            logger.error(
                "Missing CustomQuestion or InterviewSession for interaction %d", interaction_id
            )
            return

        application = await db.get(Application, session.application_id)
        interview = (
            await db.get(CustomInterview, application.interview_id)
            if application is not None
            else None
        )
        if interview is None:
            logger.error("Missing interview metadata for interaction %d", interaction_id)
            return

        turns_result = await db.execute(
            select(FollowUpQuestion)
            .where(FollowUpQuestion.interaction_id == interaction_id)
            .order_by(FollowUpQuestion.id.asc())
        )
        turns = list(turns_result.scalars().all())
        lines: list[str] = []
        for i, row in enumerate(turns, 1):
            lines.append(f"Q{i}: {row.question}")
            lines.append(f"A{i}: {row.answer or '<no answer>'}")
        conversation = "\n".join(lines)

        evaluator = Evaluator(llm_provider=LiteLLMProvider())
        result = await evaluator.evaluate(
            EvaluationRequest(
                position=interview.position,
                experience=interview.experience,
                conversation_context=conversation,
                question=custom_q.question,
                expected_answer=custom_q.expected_answer or "",
            )
        )

        interaction.score = result.score
        interaction.feedback = result.feedback
        await db.commit()

    logger.info("Graded interaction %d: score=%.1f", interaction_id, result.score)


@broker.task
async def grade_interaction_task(interaction_id: int) -> None:
    """TaskIQ-dispatchable wrapper around run_grade_interaction."""
    await run_grade_interaction(interaction_id)


async def run_grade_session(session_id: int) -> None:
    """
    Final evaluation across the entire interview session. Aggregates the
    per-Interaction scores and feedback from the QUESTIONS round into an
    interview_history payload, hands it to FinalEvaluator, and writes the
    overall score / feedback / strengths / recommendation back onto the
    InterviewSession.
    """
    async with AsyncSessionLocal() as db:
        session = await db.get(InterviewSession, session_id)
        if session is None:
            logger.error("InterviewSession %d not found", session_id)
            return
        application = await db.get(Application, session.application_id)
        interview = (
            await db.get(CustomInterview, application.interview_id)
            if application is not None
            else None
        )
        if interview is None:
            logger.error("Missing interview metadata for session %d", session_id)
            return

        interactions_result = await db.execute(
            select(Interaction)
            .where(Interaction.session_id == session_id)
            .order_by(Interaction.id.asc())
        )
        interactions = list(interactions_result.scalars().all())

        history: list[dict[str, Any]] = []
        for interaction in interactions:
            cq = await db.get(CustomQuestion, interaction.custom_question_id)
            history.append(
                {
                    "main_question": cq.question if cq else None,
                    "expected_answer": cq.expected_answer if cq else None,
                    "individual_score": interaction.score,
                    "individual_feedback": interaction.feedback,
                }
            )

        final = FinalEvaluator(llm_provider=LiteLLMProvider())
        result = await final.evaluate(
            FinalEvaluationRequest(
                position=interview.position,
                experience=interview.experience,
                interview_history=json.dumps(history),
            )
        )

        session.score = result.overall_score
        session.feedback = result.overall_feedback
        session.strengths = result.strengths
        session.recommendation = result.recommendation
        await db.commit()

    logger.info(
        "Final-graded session %d: score=%.1f recommendation=%s",
        session_id,
        result.overall_score,
        result.recommendation,
    )


@broker.task
async def grade_session_task(session_id: int) -> None:
    """TaskIQ-dispatchable wrapper around run_grade_session."""
    await run_grade_session(session_id)
