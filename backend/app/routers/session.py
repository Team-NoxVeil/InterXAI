from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.ai.follow_up_decider import FollowUpDecider
from app.ai.lite_llm import LiteLLMProvider
from app.ai.schema import FollowUpDeciderRequest
from app.database import get_db
from app.exceptions.common import BadRequestError, ForbiddenError, NotFoundError
from app.logger import get_logger
from app.models.application import CurrentRound, InterviewSession
from app.models.interaction import FollowUpQuestion, Interaction
from app.models.interview import CustomQuestion
from app.models.user import User
from app.schemas.session import (
    AnswerRequest,
    CustomQuestionPayload,
    HeartbeatResponse,
    InterviewStateResponse,
)
from app.utils.authorization import get_current_user
from app.utils.interview_flow import (
    MAX_FOLLOWUPS,
    conversation_context,
    followups_used,
    interview_metadata,
    latest_interaction,
    next_custom_question,
    open_follow_up,
    transition_to_dsa,
)
from app.utils.session_lifecycle import (
    TERMINAL_STATUSES,
    assert_session_alive,
    disqualify_if_stale,
)

logger = get_logger(__name__)

router: APIRouter = APIRouter(prefix="/sessions", tags=["sessions"])


async def _load_owned_session(
    session_id: int, user: User, db: AsyncSession
) -> InterviewSession:
    result = await db.execute(
        select(InterviewSession)
        .options(selectinload(InterviewSession.application))
        .where(InterviewSession.id == session_id)
    )
    session = result.scalar_one_or_none()
    if session is None:
        raise NotFoundError("Session not found")
    if session.application is None or session.application.user_id != user.id:
        raise ForbiddenError("You cannot access this resource")
    return session


@router.post("/{session_id}/heartbeat", response_model=HeartbeatResponse)
async def heartbeat(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> HeartbeatResponse:
    """
    Liveness ping from the candidate's frontend. Updates last_heartbeat_at on the
    session. If IMMEDIATE_DISQUALIFICATION is enabled and the previous heartbeat
    is older than HEARTBEAT_THRESHOLD_S, the session is marked disqualified
    instead and the terminal status is returned.

    A terminal status in the response is the signal for the frontend to stop
    pinging and route the candidate to the "interview ended" screen.
    """
    session = await _load_owned_session(session_id, user, db)

    if session.status in TERMINAL_STATUSES:
        return HeartbeatResponse(status=session.status)

    if await disqualify_if_stale(session, db):
        return HeartbeatResponse(status=session.status)

    session.last_heartbeat_at = datetime.utcnow()
    await db.commit()
    return HeartbeatResponse(status=session.status)


async def _handle_questions_answer(
    session: InterviewSession, answer_text: str, db: AsyncSession
) -> InterviewStateResponse:
    """
    QUESTIONS-round answer handler. Persists the candidate's answer onto the
    currently-open FollowUpQuestion turn, decides whether to ask another follow-up
    (capped at MAX_FOLLOWUPS), and otherwise advances to the next CustomQuestion
    or transitions the session into the DSA round.
    """
    interaction = await latest_interaction(session.id, db)
    if interaction is None:
        raise BadRequestError("Session has no active interaction")

    pending = await open_follow_up(interaction.id, db)
    if pending is None:
        raise BadRequestError("No pending question to answer for this session")

    pending.answer = answer_text
    await db.flush()

    used = await followups_used(interaction.id, db)
    custom_q = await db.get(CustomQuestion, interaction.custom_question_id)

    if used < MAX_FOLLOWUPS and custom_q is not None:
        interview = await interview_metadata(session, db)
        ctx = await conversation_context(interaction.id, db)
        decider = FollowUpDecider(llm_provider=LiteLLMProvider())
        decision = await decider.evaluate(
            FollowUpDeciderRequest(
                position=interview.position,
                experience=interview.experience,
                conversation_context=ctx,
                expected_answer=custom_q.expected_answer or "",
            )
        )
        if decision.needs_followup and decision.followup_question:
            db.add(
                FollowUpQuestion(
                    interaction_id=interaction.id,
                    question=decision.followup_question,
                    answer=None,
                )
            )
            await db.commit()
            return InterviewStateResponse(
                session_id=session.id,
                round=session.current_round,
                completed=False,
                question=CustomQuestionPayload(
                    interaction_id=interaction.id,
                    question=decision.followup_question,
                ),
            )

    # No follow-up needed (or cap hit). Advance to the next CustomQuestion.
    if custom_q is None:
        raise BadRequestError("Interaction references a missing CustomQuestion")

    upcoming = await next_custom_question(custom_q.interview_id, custom_q.id, db)
    if upcoming is not None:
        session.current_question_index += 1
        new_interaction = Interaction(
            session_id=session.id,
            custom_question_id=upcoming.id,
        )
        db.add(new_interaction)
        await db.flush()
        db.add(
            FollowUpQuestion(
                interaction_id=new_interaction.id,
                question=upcoming.question,
                answer=None,
            )
        )
        await db.commit()
        return InterviewStateResponse(
            session_id=session.id,
            round=session.current_round,
            completed=False,
            question=CustomQuestionPayload(
                interaction_id=new_interaction.id,
                question=upcoming.question,
            ),
        )

    # Custom questions exhausted -> hand off to the DSA round.
    return await transition_to_dsa(session, db)


@router.post("/{session_id}/answer", response_model=InterviewStateResponse)
async def answer(
    session_id: int,
    body: AnswerRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> InterviewStateResponse:
    """
    Submit an answer to the currently-served question. Handles the follow-up
    loop for the QUESTIONS round and transitions to the DSA round when those
    questions are exhausted. DSA submissions go through /dsa/submit instead.
    """
    session = await _load_owned_session(session_id, user, db)
    await assert_session_alive(session, db)

    if session.current_round == CurrentRound.QUESTIONS.value:
        return await _handle_questions_answer(session, body.answer, db)

    if session.current_round == CurrentRound.DSA.value:
        raise BadRequestError("DSA submissions must be sent to /dsa/submit, not /answer")

    if session.current_round == CurrentRound.RESUME.value:
        # Resume-round answer handling will be wired in a follow-up commit.
        raise BadRequestError("Resume round answers are not yet supported")

    raise BadRequestError(f"Unknown round: {session.current_round}")
