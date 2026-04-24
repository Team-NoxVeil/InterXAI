from typing import Annotated

from fastapi import Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.exceptions.auth import InvalidTokenError, UserNotFoundError
from app.exceptions.common import ForbiddenError
from app.logger import get_logger
from app.main import oauth2_scheme
from app.models.user import User
from app.utils.jwt_auth import JwtAuth

logger = get_logger(__name__)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    auth = JwtAuth(db_session=db)

    try:
        payload = await auth.authorize(token)
        user_id = payload.get("user_id")
    except Exception as err:
        raise InvalidTokenError() from err

    user = await db.get(User, user_id)

    if not user:
        raise UserNotFoundError()

    return user


async def verify_ownership(
    user_id: Annotated[int, Path(...)],
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.id != user_id:
        raise ForbiddenError("You cannot access this resource")
    return current_user
