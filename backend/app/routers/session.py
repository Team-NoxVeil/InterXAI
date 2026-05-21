from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.exceptions.common import ForbiddenError, NotFoundError
from app.logger import get_logger
from app.models.application import InterviewSession
from app.models.user import User
from app.schemas.session import HeartbeatResponse
from app.utils.authorization import get_current_user
from app.utils.session_lifecycle import TERMINAL_STATUSES, disqualify_if_stale

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
