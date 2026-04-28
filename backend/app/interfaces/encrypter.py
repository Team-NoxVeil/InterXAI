from abc import ABC, abstractmethod
from typing import Any


class Encrypter(ABC):
    @abstractmethod
    def encrypt(self, data: dict[str, Any]) -> str:
        pass

    @abstractmethod
    def decrypt(self, token: str) -> dict[str, Any]:
        pass
