from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.exceptions.common import ForbiddenError
from app.logger import get_logger
from app.models.application import InterviewSession, InterviewStatus

logger = get_logger(__name__)


TERMINAL_STATUSES: frozenset[str] = frozenset(
    {
        InterviewStatus.COMPLETED.value,
        InterviewStatus.CANCELLED.value,
        InterviewStatus.CHEATED.value,
        InterviewStatus.DISQUALIFIED.value,
    }
)


async def disqualify_if_stale(session: InterviewSession, db: AsyncSession) -> bool:
    """
    If IMMEDIATE_DISQUALIFICATION is enabled, the session is still active, and the
    last heartbeat is older than HEARTBEAT_THRESHOLD_S, transition the session to
    DISQUALIFIED and commit.

    Returns True iff a transition happened. Callers in non-mutation paths (e.g. the
    heartbeat endpoint itself) should treat the session as terminal afterwards.
    """
    if session.status in TERMINAL_STATUSES:
        return False
    if not settings.IMMEDIATE_DISQUALIFICATION:
        return False

    threshold = timedelta(seconds=settings.HEARTBEAT_THRESHOLD_S)
    elapsed = datetime.utcnow() - session.last_heartbeat_at
    if elapsed <= threshold:
        return False

    logger.info(
        "Disqualifying session %d (silence=%.1fs, threshold=%ds)",
        session.id,
        elapsed.total_seconds(),
        settings.HEARTBEAT_THRESHOLD_S,
    )
    session.status = InterviewStatus.DISQUALIFIED.value
    await db.commit()
    return True


async def assert_session_alive(session: InterviewSession, db: AsyncSession) -> None:
    """
    Gate for mutation endpoints (answer, dsa/run, dsa/submit, etc.). First runs the
    stale-heartbeat check, then raises ForbiddenError if the session is terminal.
    """
    await disqualify_if_stale(session, db)
    if session.status in TERMINAL_STATUSES:
        raise ForbiddenError(f"Session is {session.status} and cannot be modified")
