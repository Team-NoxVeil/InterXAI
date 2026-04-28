from abc import ABC, abstractmethod
from typing import Any

from app.models.user import User


class Authenticator(ABC):
    @abstractmethod
    async def create_user(self, username: str, password: str, email: str) -> User:
        pass

    @abstractmethod
    async def generate_token(self, user: User) -> str:
        pass

    @abstractmethod
    async def authenticate(self, username: str, password: str) -> User:
        pass

    @abstractmethod
    async def authorize(self, token: str) -> dict[str, Any]:
        pass

    @abstractmethod
    async def create_organization(self, username: str, password: str, email: str) -> User:
        pass
