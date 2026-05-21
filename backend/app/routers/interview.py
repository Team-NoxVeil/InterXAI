from datetime import datetime

from fastapi import APIRouter, Depends, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.exceptions.common import BadRequestError, ForbiddenError, NotFoundError
from app.logger import get_logger
from app.models.application import (
    Application,
    CurrentRound,
    InterviewSession,
    InterviewStatus,
)
from app.models.interaction import FollowUpQuestion, Interaction
from app.models.interview import CustomInterview, CustomQuestion, DsaTopic
from app.models.organization import Organization
from app.models.user import User
from app.schemas.interview import (
    AppliedInterviewResponse,
    CustomInterviewBasicResponse,
    CustomInterviewCreate,
    CustomInterviewResponse,
)
from app.schemas.session import CustomQuestionPayload, InterviewStateResponse
from app.utils.authorization import get_current_user, is_organization
from app.utils.default_providers import default_worker_provider

logger = get_logger(__name__)

router: APIRouter = APIRouter(prefix="/interviews", tags=["interviews"])


@router.post(
    "/",
    response_model=CustomInterviewResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_interview(
    data: CustomInterviewCreate,
    db: AsyncSession = Depends(get_db),
    org: Organization = Depends(is_organization),
) -> CustomInterviewResponse:
    """
    Create a new interview endpoint.
    """
    logger.info("Create interview request for org: %d", org.id)

    interview_data = data.model_dump(exclude={"questions", "dsa_topics"})

    interview = CustomInterview(**interview_data, org_id=org.id)

    for q_data in data.questions:
        question = CustomQuestion(**q_data.model_dump())
        interview.questions.append(question)

    for t_data in data.dsa_topics:
        topic = DsaTopic(**t_data.model_dump())
        interview.dsa_topics.append(topic)

    db.add(interview)
    await db.commit()
    await db.refresh(interview, attribute_names=["questions", "dsa_topics"])

    logger.info("Interview created successfully: %d", interview.id)
    return CustomInterviewResponse.model_validate(interview)


@router.get("/", response_model=list[CustomInterviewBasicResponse])
async def get_interviews(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[CustomInterviewBasicResponse]:
    """
    Get basic interviews list based on user role (Organization or Normal User).
    """
    if current_user.is_organization:
        logger.info("Get interviews request for org user: %d", current_user.id)
        org_result = await db.execute(
            select(Organization.id).where(Organization.account_id == current_user.id)
        )
        org_id = org_result.scalar_one_or_none()

        if not org_id:
            return []

        stmt = select(CustomInterview).where(CustomInterview.org_id == org_id)
        result = await db.execute(stmt)
        interviews = result.scalars().unique().all()

        return [CustomInterviewBasicResponse.model_validate(interview) for interview in interviews]
    else:
        logger.info("Get interviews request for normal user: %d", current_user.id)
        stmt = select(CustomInterview).where(
            CustomInterview.submission_deadline > func.now(),
            ~select(Application)
            .where(
                Application.interview_id == CustomInterview.id,
                Application.user_id == current_user.id,
            )
            .exists(),
        )
        result = await db.execute(stmt)
        interviews = result.scalars().unique().all()

        return [CustomInterviewBasicResponse.model_validate(interview) for interview in interviews]


@router.get("/applied", response_model=list[AppliedInterviewResponse])
async def get_applied_interviews(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AppliedInterviewResponse]:
    """
    Get all interviews that the current user has applied to.
    """
    logger.info("Get applied interviews request for user: %d", current_user.id)

    stmt = (
        select(CustomInterview, Application.status)
        .join(Application, CustomInterview.id == Application.interview_id)
        .where(Application.user_id == current_user.id)
    )

    result = await db.execute(stmt)

    applied_interviews = []
    for interview, app_status in result:
        data = CustomInterviewBasicResponse.model_validate(interview).model_dump()
        data["status"] = app_status
        applied_interviews.append(AppliedInterviewResponse(**data))

    return applied_interviews


@router.get("/{interview_id}", response_model=CustomInterviewResponse)
async def get_interview(
    interview_id: int,
    db: AsyncSession = Depends(get_db),
    org: Organization = Depends(is_organization),
) -> CustomInterviewResponse:
    """
    Get full interview details. Only accessible by the organization that created it.
    """
    logger.info("Get interview details request: %d by org: %d", interview_id, org.id)

    stmt = (
        select(CustomInterview)
        .options(selectinload(CustomInterview.questions), selectinload(CustomInterview.dsa_topics))
        .where(CustomInterview.id == interview_id)
    )
    result = await db.execute(stmt)
    interview = result.scalar_one_or_none()

    if not interview:
        raise NotFoundError("Interview not found")

    if interview.org_id != org.id:
        raise ForbiddenError("You cannot access this resource")

    return CustomInterviewResponse.model_validate(interview)


@router.post(
    "/{interview_id}/start",
    response_model=InterviewStateResponse,
    status_code=status.HTTP_201_CREATED,
)
async def start_interview(
    interview_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InterviewStateResponse:
    """
    Candidate-initiated entry point for the interview. Creates the InterviewSession,
    materialises the first Interaction, fires the DSA-assign and resume-generation
    background tasks, and returns the first question for the candidate to answer.

    Pre-conditions:
      - Caller is a non-org user.
      - Caller has an Application for this interview that has been approved
        (shortlisting_decision == True).
      - now() is within [interview.start_time, interview.end_time].
      - No InterviewSession has been created for this application yet.
    """
    if current_user.is_organization:
        raise ForbiddenError("Organizations cannot start interviews")

    application_result = await db.execute(
        select(Application).where(
            Application.interview_id == interview_id,
            Application.user_id == current_user.id,
        )
    )
    application = application_result.scalar_one_or_none()
    if application is None:
        raise NotFoundError("You have not applied for this interview")

    if not application.shortlisting_decision:
        raise ForbiddenError("Your application has not been approved")

    interview_result = await db.execute(
        select(CustomInterview)
        .options(selectinload(CustomInterview.questions))
        .where(CustomInterview.id == interview_id)
    )
    interview = interview_result.scalar_one_or_none()
    if interview is None:
        raise NotFoundError("Interview not found")

    now = datetime.utcnow()
    if now < interview.start_time:
        raise BadRequestError("The interview has not started yet")
    if now > interview.end_time:
        raise BadRequestError("The interview has ended")

    existing_session_result = await db.execute(
        select(InterviewSession.id).where(InterviewSession.application_id == application.id)
    )
    if existing_session_result.scalar_one_or_none() is not None:
        raise BadRequestError("Interview already in progress for this application")

    if not interview.questions:
        raise BadRequestError("Interview has no questions defined")

    first_question = sorted(interview.questions, key=lambda q: q.id)[0]

    session = InterviewSession(
        application_id=application.id,
        current_round=CurrentRound.QUESTIONS.value,
        current_question_index=1,
        status=InterviewStatus.ONGOING.value,
    )
    db.add(session)
    await db.flush()

    interaction = Interaction(
        session_id=session.id,
        custom_question_id=first_question.id,
    )
    db.add(interaction)
    await db.flush()

    # First turn in the conversation: the main question itself, answer pending.
    db.add(FollowUpQuestion(
        interaction_id=interaction.id,
        question=first_question.question,
        answer=None,
    ))
    await db.commit()
    await db.refresh(interaction)

    worker = default_worker_provider()
    await worker.assign_dsa_questions_task(session.id)
    await worker.generate_resume_questions_task(session.id)

    logger.info(
        "Started interview session %d for user %d (interview=%d)",
        session.id, current_user.id, interview_id,
    )

    return InterviewStateResponse(
        session_id=session.id,
        round=session.current_round,
        completed=False,
        question=CustomQuestionPayload(
            interaction_id=interaction.id,
            question=first_question.question,
        ),
    )
