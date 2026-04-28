from abc import ABC, abstractmethod


class Hasher(ABC):
    @abstractmethod
    def hash(self, data: str) -> str:
        pass

    @abstractmethod
    def verify(self, data: str, hash: str) -> bool:
        pass
