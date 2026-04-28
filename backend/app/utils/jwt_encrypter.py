import time
from typing import Any

import jwt

from app.config import settings
from app.interfaces.encrypter import Encrypter


class JWTEncrypter(Encrypter):
    def __init__(
        self,
        secret_key: str = settings.SECRET_KEY,
        algorithm: str = settings.ALGORITHM,
        expire_seconds: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    ) -> None:
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.expire_seconds = expire_seconds

    def encrypt(self, data: dict[str, Any]) -> str:
        payload = data.copy()
        if self.expire_seconds:
            payload["exp"] = int(time.time()) + self.expire_seconds
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def decrypt(self, token: str) -> dict[str, Any]:
        payload = jwt.decode(
            token,
            self.secret_key,
            algorithms=[self.algorithm],
            options={"require": ["exp"]} if self.expire_seconds else {},
        )
        payload.pop("exp", None)
        return payload
