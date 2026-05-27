from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.exceptions.common import ForbiddenError, NotFoundError
from app.logger import get_logger
from app.models.application import Application, InterviewSession
from app.models.interaction import DsaInteraction, Interaction, ResumeQuestion
from app.models.interview import CustomInterview
from app.models.organization import Organization
from app.schemas.leaderboard import (
    DsaInteractionResult,
    FollowUpTurn,
    InterviewLeaderboardResponse,
    LeaderboardEntry,
    QuestionInteractionResult,
    ResumeConversationResult,
    ResumeQuestionResult,
    SessionResult,
)
from app.utils.authorization import is_organization

logger = get_logger(__name__)

router: APIRouter = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


def _best_session_score(application: Application) -> float | None:
    """A candidate's interview score — the best final score across their sessions."""
    scores = [s.score for s in application.sessions if s.score is not None]
    return max(scores) if scores else None


def _build_session(
    session: InterviewSession,
    resume_questions: dict[int, list[ResumeQuestion]],
) -> SessionResult:
    questions_round: list[QuestionInteractionResult] = []
    for interaction in sorted(session.interactions, key=lambda i: i.id):
        custom_question = interaction.custom_question
        questions_round.append(
            QuestionInteractionResult(
                id=interaction.id,
                question=custom_question.question if custom_question else None,
                expected_answer=custom_question.expected_answer if custom_question else None,
                score=interaction.score,
                feedback=interaction.feedback,
                follow_ups=[
                    FollowUpTurn(id=turn.id, question=turn.question, answer=turn.answer)
                    for turn in sorted(interaction.follow_up_questions, key=lambda t: t.id)
                ],
            )
        )

    dsa_round: list[DsaInteractionResult] = []
    for dsa in sorted(session.dsa_sessions, key=lambda d: d.id):
        question = dsa.question
        dsa_round.append(
            DsaInteractionResult(
                id=dsa.id,
                problem_name=question.problem_name if question else None,
                description=question.description if question else None,
                difficulty=(question.difficulty if question else None)
                or (dsa.topic.difficulty if dsa.topic else None),
                topic=(dsa.topic.topic if dsa.topic else None)
                or (question.topic if question else None),
                language=dsa.language,
                code=dsa.code,
                score=dsa.score,
            )
        )

    resume_round: list[ResumeConversationResult] = []
    for conversation in sorted(session.resume_conversations, key=lambda c: c.id):
        resume_round.append(
            ResumeConversationResult(
                id=conversation.id,
                score=conversation.score,
                feedback=conversation.feedback,
                questions=[
                    ResumeQuestionResult(
                        id=rq.id,
                        question=rq.question,
                        expected_answer=rq.expected_answer,
                        answer=rq.answer,
                    )
                    for rq in resume_questions.get(conversation.id, [])
                ],
            )
        )

    return SessionResult(
        id=session.id,
        status=session.status,
        score=session.score,
        feedback=session.feedback,
        recommendation=session.recommendation,
        strengths=session.strengths,
        start_time=session.start_time,
        end_time=session.end_time,
        questions_round=questions_round,
        dsa_round=dsa_round,
        resume_round=resume_round,
    )


@router.get("/{interview_id}", response_model=InterviewLeaderboardResponse)
async def get_interview_leaderboard(
    interview_id: int,
    db: AsyncSession = Depends(get_db),
    org: Organization = Depends(is_organization),
) -> InterviewLeaderboardResponse:
    """
    Full leaderboard for an interview: every candidate ranked by their interview
    score, each with their complete record across all rounds — questions (with
    follow-ups), DSA attempts, resume Q&A — plus every score and feedback.

    Only accessible by the organization that owns the interview.
    """
    logger.info("Leaderboard request for interview %d by org %d", interview_id, org.id)

    interview_result = await db.execute(
        select(CustomInterview).where(CustomInterview.id == interview_id)
    )
    interview = interview_result.scalar_one_or_none()
    if not interview:
        raise NotFoundError("Interview not found")
    if interview.org_id != org.id:
        raise ForbiddenError("You cannot access this resource")

    # Eager-load the whole graph in a handful of IN queries (no N+1, no cartesian
    # blow-up from joins on the one-to-many relationships).
    applications_result = await db.execute(
        select(Application)
        .where(Application.interview_id == interview_id)
        .options(
            selectinload(Application.user),
            selectinload(Application.sessions)
            .selectinload(InterviewSession.interactions)
            .selectinload(Interaction.custom_question),
            selectinload(Application.sessions)
            .selectinload(InterviewSession.interactions)
            .selectinload(Interaction.follow_up_questions),
            selectinload(Application.sessions)
            .selectinload(InterviewSession.dsa_sessions)
            .selectinload(DsaInteraction.question),
            selectinload(Application.sessions)
            .selectinload(InterviewSession.dsa_sessions)
            .selectinload(DsaInteraction.topic),
            selectinload(Application.sessions).selectinload(InterviewSession.resume_conversations),
        )
    )
    applications = list(applications_result.scalars().unique().all())

    # ResumeConversation has no reverse relationship to ResumeQuestion, so fetch
    # the questions for every conversation in one query and group by conversation.
    conversation_ids = [
        conversation.id
        for application in applications
        for session in application.sessions
        for conversation in session.resume_conversations
    ]
    resume_questions: dict[int, list[ResumeQuestion]] = {}
    if conversation_ids:
        rq_result = await db.execute(
            select(ResumeQuestion)
            .where(ResumeQuestion.conversation_id.in_(conversation_ids))
            .order_by(ResumeQuestion.id)
        )
        for rq in rq_result.scalars().all():
            resume_questions.setdefault(rq.conversation_id, []).append(rq)

    # Rank by interview score (desc), then resume score (desc), then earliest
    # application. Candidates without a scored session sort to the bottom.
    scored = [(application, _best_session_score(application)) for application in applications]
    scored.sort(
        key=lambda pair: (
            pair[1] is not None,
            pair[1] if pair[1] is not None else 0.0,
            pair[0].score,
            -pair[0].id,
        ),
        reverse=True,
    )

    entries: list[LeaderboardEntry] = []
    for rank, (application, interview_score) in enumerate(scored, start=1):
        entries.append(
            LeaderboardEntry(
                rank=rank,
                application_id=application.id,
                user_id=application.user_id,
                username=application.user.username if application.user else "",
                email=application.user.email if application.user else "",
                status=application.status,
                resume_score=application.score,
                shortlisting_decision=application.shortlisting_decision,
                application_feedback=application.feedback,
                interview_score=interview_score,
                sessions=[
                    _build_session(session, resume_questions)
                    for session in sorted(application.sessions, key=lambda s: s.id)
                ],
            )
        )

    return InterviewLeaderboardResponse(
        interview_id=interview.id,
        position=interview.position,
        total_candidates=len(entries),
        entries=entries,
    )
