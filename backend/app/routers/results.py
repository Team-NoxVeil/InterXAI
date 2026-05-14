"""Interview Results Router.

Provides endpoints for retrieving interview results and leaderboards.
Allows organizations to view candidate performance and candidates to
see their own results.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.exceptions.common import ForbiddenError, NotFoundError
from app.logger import get_logger
from app.models.application import Application, InterviewSession
from app.models.interview import CustomInterview
from app.models.organization import Organization
from app.models.user import User
from app.schemas.interview import CustomInterviewBasicResponse
from app.utils.authorization import get_current_user, is_organization

logger = get_logger(__name__)

router: APIRouter = APIRouter(prefix="/results", tags=["results"])


@router.get(
    "/interviews/{interview_id}/leaderboard",
    status_code=status.HTTP_200_OK,
)
async def get_interview_leaderboard(
    interview_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Get the leaderboard for a specific interview.

    Returns ranked candidates by their interview scores.
    Organization owners can access their own interviews.
    Candidates can only access interviews they applied to.

    Args:
        interview_id: The ID of the interview.
        db: Database session.
        current_user: Authenticated user.

    Returns:
        dict containing interview info and ranked candidates.

    Raises:
        NotFoundError: If the interview doesn't exist.
        ForbiddenError: If the user cannot access this interview.
    """
    logger.info(
        "Leaderboard request for interview %d by user %d",
        interview_id,
        current_user.id,
    )

    # Fetch the interview
    interview_stmt = select(CustomInterview).where(
        CustomInterview.id == interview_id,
    )
    result = await db.execute(interview_stmt)
    interview = result.scalar_one_or_none()

    if not interview:
        raise NotFoundError(f"Interview with id {interview_id} not found")

    # Authorization check
    if current_user.is_organization:
        org_result = await db.execute(
            select(Organization.id).where(Organization.account_id == current_user.id)
        )
        org_id = org_result.scalar_one_or_none()
        if not org_id or interview.org_id != org_id:
            raise ForbiddenError("You can only view leaderboards for your own interviews")
    else:
        # Check if candidate applied to this interview
        app_stmt = select(Application).where(
            Application.interview_id == interview_id,
            Application.user_id == current_user.id,
        )
        app_result = await db.execute(app_stmt)
        if not app_result.scalar_one_or_none():
            raise ForbiddenError("You must apply to this interview to view results")

    # Fetch all completed sessions with candidate info for this interview
    leaderboard_stmt = (
        select(
            Application.id.label("application_id"),
            User.id.label("user_id"),
            User.username,
            User.email,
            InterviewSession.score,
            InterviewSession.status,
            InterviewSession.feedback,
            InterviewSession.recommendation,
            InterviewSession.end_time,
        )
        .join(Application, InterviewSession.application_id == Application.id)
        .join(User, Application.user_id == User.id)
        .where(
            Application.interview_id == interview_id,
            InterviewSession.status == "completed",
        )
        .order_by(desc(InterviewSession.score))
    )

    lb_result = await db.execute(leaderboard_stmt)
    rows = lb_result.all()

    candidates = []
    for rank, row in enumerate(rows, start=1):
        candidates.append({
            "rank": rank,
            "candidate_name": row.username or f"Candidate #{row.user_id}",
            "email": row.email,
            "score": row.score,
            "feedback": row.feedback,
            "recommendation": row.recommendation,
            "completed_at": row.end_time.isoformat() if row.end_time else None,
        })

    # Calculate summary statistics
    total_candidates = len(candidates)
    avg_score = round(
        sum(c["score"] for c in candidates) / total_candidates, 2
    ) if total_candidates > 0 else 0

    return {
        "interview": CustomInterviewBasicResponse.model_validate(
            interview
        ).model_dump(),
        "summary": {
            "total_completed": total_candidates,
            "average_score": avg_score,
            "position": interview.position,
        },
        "leaderboard": candidates,
    }


@router.get(
    "/interviews/{interview_id}/candidates",
    status_code=status.HTTP_200_OK,
)
async def get_interview_candidates(
    interview_id: int,
    status_filter: str | None = None,
    db: AsyncSession = Depends(get_db),
    org: Organization = Depends(is_organization),
) -> dict:
    """Get all candidates for a specific interview with optional status filtering.

    Only accessible by the organization that created the interview.

    Args:
        interview_id: The ID of the interview.
        status_filter: Optional filter by application status.
        db: Database session.
        org: Authenticated organization.

    Returns:
        dict containing interview info and candidate list.

    Raises:
        NotFoundError: If the interview doesn't exist.
        ForbiddenError: If the org doesn't own this interview.
    """
    logger.info(
        "Candidates list request for interview %d by org %d",
        interview_id,
        org.id,
    )

    # Verify interview ownership
    interview_stmt = select(CustomInterview).where(
        CustomInterview.id == interview_id,
        CustomInterview.org_id == org.id,
    )
    result = await db.execute(interview_stmt)
    interview = result.scalar_one_or_none()

    if not interview:
        raise NotFoundError(
            f"Interview with id {interview_id} not found "
            "or not owned by your organization"
        )

    # Build candidate query
    candidate_stmt = (
        select(
            Application.id.label("application_id"),
            User.id.label("user_id"),
            User.username,
            User.email,
            Application.status.label("application_status"),
            Application.score.label("resume_score"),
            InterviewSession.score.label("interview_score"),
            InterviewSession.status.label("session_status"),
            InterviewSession.recommendation,
        )
        .join(User, Application.user_id == User.id)
        .outerjoin(
            InterviewSession,
            InterviewSession.application_id == Application.id,
        )
        .where(Application.interview_id == interview_id)
    )

    if status_filter:
        candidate_stmt = candidate_stmt.where(
            Application.status == status_filter,
        )

    candidate_stmt = candidate_stmt.order_by(desc(Application.score))

    cand_result = await db.execute(candidate_stmt)
    rows = cand_result.all()

    candidates = []
    for row in rows:
        candidates.append({
            "candidate_name": row.username or f"Candidate #{row.user_id}",
            "email": row.email,
            "application_status": row.application_status,
            "resume_score": row.resume_score,
            "interview_score": row.interview_score,
            "session_status": row.session_status or "not_started",
            "recommendation": row.recommendation,
        })

    # Count by status
    status_counts_stmt = (
        select(Application.status, func.count(Application.id))
        .where(Application.interview_id == interview_id)
        .group_by(Application.status)
    )
    status_result = await db.execute(status_counts_stmt)
    status_counts = {status: count for status, count in status_result.all()}

    return {
        "interview": {
            "id": interview.id,
            "position": interview.position,
            "experience": interview.experience,
        },
        "summary": {
            "total_applicants": sum(status_counts.values()),
            "status_breakdown": status_counts,
        },
        "candidates": candidates,
    }


@router.get(
    "/my-results",
    status_code=status.HTTP_200_OK,
)
async def get_my_results(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Get all interview results for the current candidate.

    Returns a summary of all interviews the candidate has applied to,
    along with their scores and statuses.

    Args:
        db: Database session.
        current_user: Authenticated user.

    Returns:
        dict containing user's interview results.
    """
    logger.info("My results request for user %d", current_user.id)

    results_stmt = (
        select(
            CustomInterview.id.label("interview_id"),
            CustomInterview.position,
            CustomInterview.experience,
            Organization.name.label("org_name"),
            Application.status.label("application_status"),
            Application.score.label("resume_score"),
            InterviewSession.score.label("interview_score"),
            InterviewSession.status.label("session_status"),
            InterviewSession.feedback,
            InterviewSession.recommendation,
        )
        .join(Application, Application.interview_id == CustomInterview.id)
        .join(Organization, CustomInterview.org_id == Organization.id)
        .outerjoin(
            InterviewSession,
            InterviewSession.application_id == Application.id,
        )
        .where(Application.user_id == current_user.id)
        .order_by(desc(Application.created_at))
    )

    result = await db.execute(results_stmt)
    rows = result.all()

    results = []
    total_score = 0
    completed_count = 0

    for row in rows:
        interview_score = row.interview_score or 0
        if row.session_status == "completed":
            total_score += interview_score
            completed_count += 1

        results.append({
            "interview_id": row.interview_id,
            "position": row.position,
            "experience": row.experience,
            "organization": row.org_name,
            "application_status": row.application_status,
            "resume_score": row.resume_score,
            "interview_score": interview_score,
            "session_status": row.session_status or "not_started",
            "feedback": row.feedback,
            "recommendation": row.recommendation,
        })

    avg_score = round(total_score / completed_count, 2) if completed_count > 0 else 0

    return {
        "summary": {
            "total_applied": len(results),
            "completed_interviews": completed_count,
            "average_score": avg_score,
        },
        "results": results,
    }
