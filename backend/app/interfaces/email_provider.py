from abc import ABC, abstractmethod

class EmailProvider(ABC):
    @abstractmethod
    async def send_email(self, to_email: list[str], subject: str, body: str) -> None:
        pass