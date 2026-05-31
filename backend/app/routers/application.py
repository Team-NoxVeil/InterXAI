import base64
from datetime import datetime

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.exceptions.common import BadRequestError, ForbiddenError, NotFoundError
from app.logger import get_logger
from app.models.application import Application
from app.models.interview import CustomInterview
from app.models.organization import Organization
from app.models.user import User
from app.schemas.application import ApplicationResponse
from app.utils.authorization import get_current_user, is_organization
from app.utils.default_providers import default_worker_provider

logger = get_logger(__name__)

router: APIRouter = APIRouter(prefix="/applications", tags=["applications"])


@router.get("/{interview_id}", response_model=list[ApplicationResponse])
async def get_interview_applications(
    interview_id: int,
    db: AsyncSession = Depends(get_db),
    org: Organization = Depends(is_organization),
) -> list[ApplicationResponse]:
    """
    Get all applications for a specific interview. Only accessible by the interview owner.
    """
    logger.info("Get applications request for interview: %d by org: %d", interview_id, org.id)

    interview_result = await db.execute(
        select(CustomInterview).where(CustomInterview.id == interview_id)
    )
    interview = interview_result.scalar_one_or_none()

    if not interview:
        raise NotFoundError("Interview not found")

    if interview.org_id != org.id:
        raise ForbiddenError("You cannot access this resource")

    applications_result = await db.execute(
        select(Application).where(Application.interview_id == interview_id)
    )
    applications = applications_result.scalars().all()

    return [ApplicationResponse.model_validate(app) for app in applications]


@router.post(
    "/{interview_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def apply_for_interview(
    interview_id: int,
    resume: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ApplicationResponse:
    """
    Apply for an interview.
    """
    logger.info("Apply request for interview: %d by user: %d", interview_id, current_user.id)

    if current_user.is_organization:
        raise ForbiddenError("Organizations cannot apply for interviews")

    interview_result = await db.execute(
        select(CustomInterview).where(CustomInterview.id == interview_id)
    )
    interview = interview_result.scalar_one_or_none()

    if not interview:
        raise NotFoundError("Interview not found")

    now = datetime.now(interview.submission_deadline.tzinfo)
    if interview.submission_deadline <= now:
        raise BadRequestError("The submission deadline for this interview has passed")

    existing_app_result = await db.execute(
        select(Application).where(
            Application.interview_id == interview_id,
            Application.user_id == current_user.id,
        )
    )
    if existing_app_result.scalar_one_or_none():
        raise BadRequestError("You have already applied for this interview")

    file_bytes = await resume.read()

    time_str = int(datetime.utcnow().timestamp())
    new_filename = f"{current_user.username}_{interview_id}_{time_str}.pdf"

    application = Application(
        user_id=current_user.id,
        interview_id=interview_id,
        resume=new_filename,
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)

    file_bytes_b64 = base64.b64encode(file_bytes).decode("utf-8")
    await default_worker_provider().process_resume_task(
        file_bytes_b64, new_filename, application.id
    )

    logger.info("Application created successfully: %d", application.id)
    return ApplicationResponse.model_validate(application)


@router.patch("/{application_id}/shortlist", response_model=ApplicationResponse)
async def shortlist_application(
    application_id: int,
    db: AsyncSession = Depends(get_db),
    org: Organization = Depends(is_organization),
) -> ApplicationResponse:
    """
    Approve or reject (toggle shortlisting_decision) for an application.
    Only the org that owns the interview may do this.
    """
    logger.info(
        "Shortlist toggle request for application: %d by org: %d",
        application_id,
        org.id,
    )

    app_result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    application = app_result.scalar_one_or_none()

    if not application:
        raise NotFoundError("Application not found")

    # Verify the org owns the interview this application belongs to
    interview_result = await db.execute(
        select(CustomInterview).where(CustomInterview.id == application.interview_id)
    )
    interview = interview_result.scalar_one_or_none()

    if not interview or interview.org_id != org.id:
        raise ForbiddenError("You cannot modify this application")

    application.shortlisting_decision = not application.shortlisting_decision
    await db.commit()
    await db.refresh(application)

    logger.info(
        "Application %d shortlisting_decision set to %s",
        application_id,
        application.shortlisting_decision,
    )
    return ApplicationResponse.model_validate(application)
