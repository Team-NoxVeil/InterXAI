from abc import ABC, abstractmethod


class BackgroundWorkerInterface(ABC):
    @abstractmethod
    async def process_resume_task(
        file_bytes_b64: str, file_name: str, application_id: int
    ) -> None:
        pass
