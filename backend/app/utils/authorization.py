from typing import Annotated

from fastapi import Depends, Path
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.exceptions.auth import InvalidTokenError, UserNotFoundError
from app.exceptions.common import ForbiddenError, NotFoundError
from app.logger import get_logger
from app.models.organization import Organization
from app.models.user import User
from app.utils.jwt_auth import JwtAuth

logger = get_logger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


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


async def verify_org_ownership(
    org_id: Annotated[int, Path(...)],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Organization:
    result = await db.execute(select(Organization).where(Organization.id == org_id))
    org = result.scalar_one_or_none()

    if not org:
        raise NotFoundError("Organization not found")

    if org.account_id != current_user.id:
        raise ForbiddenError("You cannot access this resource")

    return org


async def is_organization(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Organization:
    if not current_user.is_organization:
        raise ForbiddenError("Only organizations can perform this action")

    result = await db.execute(
        select(Organization).where(Organization.account_id == current_user.id)
    )
    org = result.scalar_one_or_none()

    if not org:
        raise NotFoundError("Organization profile not found")

    return org
