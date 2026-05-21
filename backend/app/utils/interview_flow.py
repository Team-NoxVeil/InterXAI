from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.common import BadRequestError
from app.logger import get_logger
from app.models.application import (
    Application,
    CurrentRound,
    InterviewSession,
    InterviewStatus,
)
from app.models.dsa_question import DsaQuestion
from app.models.interaction import (
    DsaInteraction,
    FollowUpQuestion,
    Interaction,
    ResumeConversation,
    ResumeQuestion,
)
from app.models.interview import CustomInterview, CustomQuestion
from app.schemas.session import (
    DsaQuestionPayload,
    InterviewStateResponse,
    ResumeQuestionPayload,
)

logger = get_logger(__name__)


# Maximum follow-up questions per main question, per the interview design.
MAX_FOLLOWUPS = 3


async def latest_interaction(session_id: int, db: AsyncSession) -> Interaction | None:
    """The most-recently-created Interaction for this session (i.e. the current one)."""
    result = await db.execute(
        select(Interaction)
        .where(Interaction.session_id == session_id)
        .order_by(Interaction.id.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


async def open_follow_up(interaction_id: int, db: AsyncSession) -> FollowUpQuestion | None:
    """Most recent FollowUpQuestion row for this interaction with no answer yet."""
    result = await db.execute(
        select(FollowUpQuestion)
        .where(
            FollowUpQuestion.interaction_id == interaction_id,
            FollowUpQuestion.answer.is_(None),
        )
        .order_by(FollowUpQuestion.id.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


async def followups_used(interaction_id: int, db: AsyncSession) -> int:
    """
    Number of actual follow-ups asked so far for this interaction.

    The first FollowUpQuestion row holds the main question; subsequent rows are
    the actual follow-ups. We return `total - 1` (clamped at zero) so callers can
    compare directly against MAX_FOLLOWUPS.
    """
    result = await db.execute(
        select(func.count(FollowUpQuestion.id)).where(
            FollowUpQuestion.interaction_id == interaction_id
        )
    )
    total = int(result.scalar_one() or 0)
    return max(0, total - 1)


async def conversation_context(interaction_id: int, db: AsyncSession) -> str:
    """Build a Q1/A1 ... Qn/An transcript for the FollowUpDecider / Evaluator."""
    result = await db.execute(
        select(FollowUpQuestion)
        .where(FollowUpQuestion.interaction_id == interaction_id)
        .order_by(FollowUpQuestion.id.asc())
    )
    rows = list(result.scalars().all())
    lines: list[str] = []
    for i, row in enumerate(rows, 1):
        lines.append(f"Q{i}: {row.question}")
        lines.append(f"A{i}: {row.answer or '<no answer yet>'}")
    return "\n".join(lines)


async def next_custom_question(
    interview_id: int, after_question_id: int, db: AsyncSession
) -> CustomQuestion | None:
    """The next CustomQuestion (by id) for this interview after the given one."""
    result = await db.execute(
        select(CustomQuestion)
        .where(
            CustomQuestion.interview_id == interview_id,
            CustomQuestion.id > after_question_id,
        )
        .order_by(CustomQuestion.id.asc())
        .limit(1)
    )
    return result.scalar_one_or_none()


async def first_dsa_interaction(
    session_id: int, db: AsyncSession
) -> tuple[DsaInteraction, DsaQuestion] | None:
    """
    The first (oldest) DsaInteraction assigned to this session, paired with its
    DsaQuestion. Returns None when the session has no DSA interactions.
    """
    result = await db.execute(
        select(DsaInteraction)
        .where(DsaInteraction.session_id == session_id)
        .order_by(DsaInteraction.id.asc())
        .limit(1)
    )
    interaction = result.scalar_one_or_none()
    if interaction is None or interaction.question_id is None:
        return None
    question = await db.get(DsaQuestion, interaction.question_id)
    if question is None:
        return None
    return interaction, question


async def current_dsa_interaction(
    session: InterviewSession, db: AsyncSession
) -> tuple[DsaInteraction, DsaQuestion] | None:
    """
    The DsaInteraction at session.current_question_index (1-based), paired with
    its DsaQuestion. Returns None if the index is out of range or the question
    record is missing.
    """
    offset = max(0, session.current_question_index - 1)
    result = await db.execute(
        select(DsaInteraction)
        .where(DsaInteraction.session_id == session.id)
        .order_by(DsaInteraction.id.asc())
        .offset(offset)
        .limit(1)
    )
    interaction = result.scalar_one_or_none()
    if interaction is None or interaction.question_id is None:
        return None
    question = await db.get(DsaQuestion, interaction.question_id)
    if question is None:
        return None
    return interaction, question


def dsa_payload_for(
    interaction: DsaInteraction, question: DsaQuestion
) -> DsaQuestionPayload:
    """Build the candidate-facing DSA payload (no hidden test cases)."""
    return DsaQuestionPayload(
        interaction_id=interaction.id,
        problem_name=question.problem_name,
        description=question.description,
        sample_test_cases=question.sample_test_cases,
        time_limit_ms=question.time_limit_ms,
    )


async def mark_session_completed(
    session: InterviewSession, db: AsyncSession
) -> InterviewStateResponse:
    """Terminal-transition the session and return the final completed response."""
    session.status = InterviewStatus.COMPLETED.value
    session.end_time = datetime.utcnow()
    await db.commit()
    return InterviewStateResponse(
        session_id=session.id,
        round=session.current_round,
        completed=True,
        question=None,
    )


async def transition_to_resume(
    session: InterviewSession, db: AsyncSession
) -> InterviewStateResponse:
    """
    Flip to the RESUME round and return the first resume question. If the
    interview has ask_questions_on_resume=False (no ResumeConversation was ever
    created) or the conversation has no questions, fall through to completion.
    """
    conv_result = await db.execute(
        select(ResumeConversation).where(ResumeConversation.session_id == session.id)
    )
    conversation = conv_result.scalar_one_or_none()
    if conversation is None:
        return await mark_session_completed(session, db)

    rq_result = await db.execute(
        select(ResumeQuestion)
        .where(ResumeQuestion.conversation_id == conversation.id)
        .order_by(ResumeQuestion.id.asc())
        .limit(1)
    )
    first_rq = rq_result.scalar_one_or_none()
    if first_rq is None:
        return await mark_session_completed(session, db)

    session.current_round = CurrentRound.RESUME.value
    session.current_question_index = 1
    await db.commit()

    return InterviewStateResponse(
        session_id=session.id,
        round=session.current_round,
        completed=False,
        question=ResumeQuestionPayload(
            question_id=first_rq.id,
            question=first_rq.question,
        ),
    )


async def transition_to_dsa(
    session: InterviewSession, db: AsyncSession
) -> InterviewStateResponse:
    """
    Flip the session to the DSA round (index reset to 1), load the first DSA
    interaction, and return its candidate-facing payload. Raises if no DSA
    interaction was assigned (background-task race / mis-configured interview).
    """
    pair = await first_dsa_interaction(session.id, db)
    if pair is None:
        raise BadRequestError(
            "Session has no DSA questions assigned — the background task may not have"
            " completed yet, or the interview has no DSA topics configured."
        )

    interaction, question = pair
    session.current_round = CurrentRound.DSA.value
    session.current_question_index = 1
    await db.commit()

    return InterviewStateResponse(
        session_id=session.id,
        round=session.current_round,
        completed=False,
        question=dsa_payload_for(interaction, question),
    )


async def interview_metadata(
    session: InterviewSession, db: AsyncSession
) -> CustomInterview:
    """Load the CustomInterview tied to this session (via application.interview_id)."""
    result = await db.execute(
        select(CustomInterview)
        .join(Application, Application.interview_id == CustomInterview.id)
        .where(Application.id == session.application_id)
    )
    interview = result.scalar_one_or_none()
    if interview is None:
        # Should be impossible if FKs are intact, but raise rather than return None
        # so callers can rely on a non-null return.
        raise BadRequestError("Session has no associated interview")
    return interview
