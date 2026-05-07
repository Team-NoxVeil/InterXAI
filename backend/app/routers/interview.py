from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.logger import get_logger
from app.models.interview import CustomInterview, CustomQuestion, DsaTopic
from app.models.organization import Organization
from app.schemas.interview import CustomInterviewCreate, CustomInterviewResponse
from app.utils.authorization import is_organization

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
