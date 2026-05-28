from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.exceptions.auth import (
    EmailAlreadyExistsError,
    InvalidTokenError,
    InvalidUserCredentialsError,
    UserAlreadyExistsError,
)
from app.interfaces.authenticator import Authenticator
from app.interfaces.hasher import Hasher
from app.models.organization import Organization
from app.models.user import User, UserProfile
from app.utils.bcrypt_hasher import BcryptHasher
from app.utils.jwt_encrypter import JWTEncrypter


class JwtAuth(Authenticator):
    def __init__(self, db_session: AsyncSession) -> None:
        self.db_session = db_session
        self.encrypter = JWTEncrypter(
            secret_key=settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
            expire_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
        self.hasher: Hasher = BcryptHasher(rounds=12)

    async def create_user(self, username: str, password: str, email: str) -> User:

        existing_user = await self.db_session.execute(select(User).where(User.username == username))
        if existing_user.scalar_one_or_none():
            raise UserAlreadyExistsError(username)

        existing_email = await self.db_session.execute(select(User).where(User.email == email))
        if existing_email.scalar_one_or_none():
            raise EmailAlreadyExistsError(email)

        hashed_password = self.hasher.hash(password)

        user = User(
            username=username,
            email=email,
            password_hash=hashed_password,
        )

        self.db_session.add(user)

        try:
            await self.db_session.flush()
        except Exception as e:
            import traceback

            traceback.print_exc()
            print("FLUSH ERROR:", e)
            raise

        profile = UserProfile(user_id=user.id)
        self.db_session.add(profile)

        try:
            await self.db_session.commit()
        except Exception as e:
            import traceback

            traceback.print_exc()
            print("COMMIT ERROR:", e)
            raise

        await self.db_session.refresh(user, attribute_names=["profile"])

        return user

    async def create_organization(self, username: str, password: str, email: str) -> User:

        existing_user = await self.db_session.execute(select(User).where(User.username == username))
        if existing_user.scalar_one_or_none():
            raise UserAlreadyExistsError(username)

        existing_email = await self.db_session.execute(select(User).where(User.email == email))
        if existing_email.scalar_one_or_none():
            raise EmailAlreadyExistsError(email)

        hashed_password = self.hasher.hash(password)

        user = User(
            username=username,
            email=email,
            password_hash=hashed_password,
            is_organization=True,
        )

        self.db_session.add(user)

        await self.db_session.flush()

        org = Organization(account_id=user.id)
        self.db_session.add(org)

        await self.db_session.commit()

        await self.db_session.refresh(user, attribute_names=["organization"])

        return user

    async def generate_token(self, user: User) -> str:
        token = self.encrypter.encrypt({"user_id": user.id, "username": user.username})
        return token

    async def authenticate(self, username: str, password: str) -> User:

        result = await self.db_session.execute(select(User).where(User.username == username))

        user = result.scalar_one_or_none()

        if not user:
            raise InvalidUserCredentialsError()

        # OIDC-only accounts have no password set; reject password login for them.
        if not user.password_hash:
            raise InvalidUserCredentialsError()

        if not self.hasher.verify(password, user.password_hash):
            raise InvalidUserCredentialsError()

        return user

    async def authorize(self, token: str) -> dict[str, Any]:
        try:
            payload = self.encrypter.decrypt(token)
            return payload
        except Exception as err:
            raise InvalidTokenError() from err

    async def _generate_unique_username(self, base: str) -> str:
        base = base.strip() or "user"
        candidate = base
        suffix = 1
        while True:
            result = await self.db_session.execute(select(User).where(User.username == candidate))
            if result.scalar_one_or_none() is None:
                return candidate
            suffix += 1
            candidate = f"{base}{suffix}"

    async def get_or_create_oidc_user(self, email: str, name: str) -> User:
        result = await self.db_session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user:
            return user

        # The Google display name is not unique (or may be empty), but username is.
        # Derive a base from the name, falling back to the email local-part, then
        # ensure uniqueness so account creation can't fail on a username clash.
        base_username = (name or "").strip() or email.split("@")[0]
        username = await self._generate_unique_username(base_username)

        new_user = User(
            username=username,
            email=email,
        )
        self.db_session.add(new_user)
        await self.db_session.flush()

        profile = UserProfile(user_id=new_user.id)
        self.db_session.add(profile)

        await self.db_session.commit()
        await self.db_session.refresh(new_user, attribute_names=["profile"])

        return new_user
