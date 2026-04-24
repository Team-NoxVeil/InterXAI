from typing import Annotated

from fastapi import Depends, Header, Path
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.exceptions.auth import InvalidTokenError, UserNotFoundError
from app.exceptions.common import ForbiddenError
from app.logger import get_logger
from app.models.user import User
from app.utils.jwt_auth import JwtAuth

logger = get_logger(__name__)


async def get_current_user(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        logger.warning("Missing or invalid authorization header")
        raise InvalidTokenError()

    token = authorization.split(" ")[1]

    auth = JwtAuth(db_session=db)
    payload = await auth.authorize(token)

    user_id = payload.get("user_id")
    if not user_id:
        logger.warning("Invalid token: no user_id in payload")
        raise InvalidTokenError()

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        logger.warning("User not found during auth: %d", user_id)
        raise UserNotFoundError(user_id=user_id)

    logger.info("User authenticated: %d", user_id)
    return user


async def verify_ownership(
    user_id: Annotated[int, Path(...)],
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.id != user_id:
        raise ForbiddenError("You cannot access this resource")
    return current_user
