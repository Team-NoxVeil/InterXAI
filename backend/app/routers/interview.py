from fastapi import APIRouter, Depends, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.exceptions.common import ForbiddenError, NotFoundError
from app.logger import get_logger
from app.models.application import Application
from app.models.interview import CustomInterview, CustomQuestion, DsaTopic
from app.models.organization import Organization
from app.models.user import User
from app.schemas.interview import (
    AppliedInterviewResponse,
    CustomInterviewBasicResponse,
    CustomInterviewCreate,
    CustomInterviewReadResponse,
    CustomInterviewResponse,
)
from app.utils.authorization import get_current_user, is_organization

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


@router.get("/{interview_id}", response_model=CustomInterviewReadResponse)
async def get_interview(
    interview_id: int,
    db: AsyncSession = Depends(get_db),
    org: Organization = Depends(is_organization),
) -> CustomInterviewReadResponse:
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

    return CustomInterviewReadResponse.model_validate(interview)
