from typing import cast

from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.exceptions.auth import UserNotFoundError
from app.logger import get_logger
from app.models.user import User, UserProfile
from app.schemas.user import (
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
)
from app.utils.authorization import get_current_user, verify_ownership
from app.utils.bcrypt_hasher import BcryptHasher
from app.utils.google_oauth import oauth
from app.utils.jwt_auth import JwtAuth

logger = get_logger(__name__)

router: APIRouter = APIRouter(prefix="/users", tags=["users"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    """
    User registration endpoint.
    """
    logger.info("Signup request for user: %s", user_data.username)
    auth = JwtAuth(db_session=db)
    user = await auth.create_user(
        username=user_data.username,
        password=user_data.password,
        email=user_data.email,
    )
    token = await auth.generate_token(user)
    await db.refresh(user, attribute_names=["profile"])
    logger.info("User created successfully: %s (id=%d)", user_data.username, user.id)
    return TokenResponse(token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    """Authenticate user and return access token."""
    logger.info("Login request for user: %s", credentials.username)
    auth = JwtAuth(db_session=db)
    user = await auth.authenticate(
        username=credentials.username,
        password=credentials.password,
    )
    token = await auth.generate_token(user)
    await db.refresh(user, attribute_names=["profile"])
    logger.info("User logged in successfully: %s", credentials.username)
    return TokenResponse(token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> UserResponse:
    await db.refresh(current_user, attribute_names=["profile"])
    return UserResponse.model_validate(current_user)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> UserResponse:
    """
    Get user by ID endpoint.
    """
    logger.info("Get user request for id: %d", user_id)
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        logger.warning("User not found: %d", user_id)
        raise UserNotFoundError(user_id=user_id)
    logger.info("User retrieved successfully: %d", user_id)
    await db.refresh(user, attribute_names=["profile"])
    return UserResponse.model_validate(user)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(verify_ownership),
) -> UserResponse:
    """
    Update user by ID endpoint.
    """
    logger.info("Update user request for id: %d", user_id)
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        logger.warning("User not found for update: %d", user_id)
        raise UserNotFoundError(user_id=user_id)

    update_data = user_data.model_dump(exclude_unset=True, exclude={"profile"})
    if update_data:
        hasher = BcryptHasher()
        for field, value in update_data.items():
            if value is not None:
                if field == "password":
                    value = hasher.hash(value)
                setattr(user, field, value)

    # Handle profile update
    if user_data.profile is not None:
        profile_result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
        profile = profile_result.scalar_one_or_none()

        if not profile:
            profile = UserProfile(user_id=user_id)
            db.add(profile)

        profile_update_data = user_data.profile.model_dump(exclude_unset=True)
        for field, value in profile_update_data.items():
            if value is not None and hasattr(profile, field):
                setattr(profile, field, value)

    await db.commit()
    await db.refresh(user)
    await db.refresh(user, attribute_names=["profile"])
    logger.info("User updated successfully: %d", user_id)
    return UserResponse.model_validate(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _current_user: User = Depends(verify_ownership),
) -> None:
    """
    Delete user by ID endpoint.
    """
    logger.info("Delete user request for id: %d", user_id)
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        logger.warning("User not found for delete: %d", user_id)
        raise UserNotFoundError(user_id=user_id)

    await db.delete(user)
    await db.commit()
    logger.info("User deleted successfully: %d", user_id)


# Google Oauth login
@router.get("/google/login")
async def google_login(request: Request) -> RedirectResponse:
    return cast(
        RedirectResponse,
        await oauth.google.authorize_redirect(
            request, redirect_uri="http://localhost:8000/users/google/callback"
        ),
    )


@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> RedirectResponse:
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    email = user_info["email"]
    username = user_info.get("name", email.split("@")[0])
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        user = User(
            username=username,
            email=email,
            password_hash="none",
        )
        db.add(user)
        await db.flush()
        profile = UserProfile(user_id=user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(user)
    auth = JwtAuth(db)
    access_token = await auth.generate_token(user)

    return RedirectResponse(url=f"{settings.FRONTEND_URL}?token={access_token}")
