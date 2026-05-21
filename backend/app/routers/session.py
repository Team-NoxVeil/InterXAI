from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.ai.follow_up_decider import FollowUpDecider
from app.ai.lite_llm import LiteLLMProvider
from app.ai.schema import FollowUpDeciderRequest
from app.background.taskiq.tasks.dsa_execution import run_evaluate_submission
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
    DsaCaseResult,
    DsaRunRequest,
    DsaRunResponse,
    DsaSubmitRequest,
    DsaSubmitResponse,
    HeartbeatResponse,
    InterviewStateResponse,
    ResumeQuestionPayload,
)
from app.utils.authorization import get_current_user
from app.utils.interview_flow import (
    MAX_FOLLOWUPS,
    conversation_context,
    current_dsa_interaction,
    current_resume_question,
    dsa_payload_for,
    followups_used,
    interview_metadata,
    latest_interaction,
    mark_session_completed,
    next_custom_question,
    next_resume_question,
    open_follow_up,
    transition_to_dsa,
    transition_to_resume,
)
from app.utils.piston_client import PistonClient
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
        return await _handle_resume_answer(session, body.answer, db)

    raise BadRequestError(f"Unknown round: {session.current_round}")


async def _handle_resume_answer(
    session: InterviewSession, answer_text: str, db: AsyncSession
) -> InterviewStateResponse:
    """
    RESUME-round answer handler. Linear flow (no follow-ups): persist the
    candidate's response onto the current ResumeQuestion, advance to the next
    one, or mark the session COMPLETED when the resume questions are exhausted.
    """
    current = await current_resume_question(session, db)
    if current is None:
        raise BadRequestError("No active resume question for this session")

    current.answer = answer_text
    await db.flush()

    upcoming = await next_resume_question(current.conversation_id, current.id, db)
    if upcoming is None:
        return await mark_session_completed(session, db)

    session.current_question_index += 1
    await db.commit()

    return InterviewStateResponse(
        session_id=session.id,
        round=session.current_round,
        completed=False,
        question=ResumeQuestionPayload(
            question_id=upcoming.id,
            question=upcoming.question,
        ),
    )


@router.post("/{session_id}/dsa/run", response_model=DsaRunResponse)
async def dsa_run(
    session_id: int,
    body: DsaRunRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> DsaRunResponse:
    """
    Free-form code execution for the candidate during the DSA round. Runs the
    submitted source against the provided stdin (custom input or sample input
    chosen by the frontend) and returns stdout/stderr/exit_code.

    This endpoint does NOT update score or advance the session — it's the
    candidate's scratchpad. Final grading happens via /dsa/submit.
    """
    session = await _load_owned_session(session_id, user, db)
    await assert_session_alive(session, db)

    if session.current_round != CurrentRound.DSA.value:
        raise BadRequestError(
            f"/dsa/run is only valid during the DSA round (current: {session.current_round})"
        )

    pair = await current_dsa_interaction(session, db)
    if pair is None:
        raise BadRequestError("No active DSA question for this session")
    _, question = pair

    client = PistonClient()
    result = await client.execute(
        source_code=body.source_code,
        language=body.language,
        stdin=body.stdin,
        run_timeout_ms=question.time_limit_ms,
    )
    return DsaRunResponse(
        stdout=result.stdout,
        stderr=result.stderr,
        exit_code=result.exit_code,
    )


@router.post("/{session_id}/dsa/submit", response_model=DsaSubmitResponse)
async def dsa_submit(
    session_id: int,
    body: DsaSubmitRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> DsaSubmitResponse:
    """
    Final submission for the current DSA question. Runs the candidate's code
    against every hidden test_case on the DsaQuestion, persists code/language/
    score onto the DsaInteraction, then advances the session — either to the
    next DSA question, the RESUME round, or terminal COMPLETED.

    The response carries both the per-case results (so the frontend can show
    pass/fail per case) and next_state so a single roundtrip is enough.
    """
    session = await _load_owned_session(session_id, user, db)
    await assert_session_alive(session, db)

    if session.current_round != CurrentRound.DSA.value:
        raise BadRequestError(
            f"/dsa/submit is only valid during the DSA round (current: {session.current_round})"
        )

    pair = await current_dsa_interaction(session, db)
    if pair is None:
        raise BadRequestError("No active DSA question for this session")
    interaction, _ = pair
    interaction_id = interaction.id

    # run_evaluate_submission opens its own AsyncSession and commits the
    # candidate's code/language/score onto the DsaInteraction internally.
    case_results_raw = await run_evaluate_submission(
        interaction_id, body.source_code, body.language
    )

    # Re-load the interaction so we can read the freshly-committed score.
    await db.refresh(interaction)
    score = interaction.score or 0.0

    # Advance to the next DSA question, or transition out of the DSA round.
    session.current_question_index += 1
    await db.commit()

    next_pair = await current_dsa_interaction(session, db)
    if next_pair is not None:
        next_interaction, next_question = next_pair
        next_state = InterviewStateResponse(
            session_id=session.id,
            round=session.current_round,
            completed=False,
            question=dsa_payload_for(next_interaction, next_question),
        )
    else:
        next_state = await transition_to_resume(session, db)

    return DsaSubmitResponse(
        case_results=[DsaCaseResult(**c) for c in case_results_raw],
        score=score,
        next_state=next_state,
    )
