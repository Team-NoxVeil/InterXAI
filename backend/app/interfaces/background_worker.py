from abc import ABC, abstractmethod


class BackgroundWorkerInterface(ABC):
    @abstractmethod
    async def startup(self) -> None:
        pass

    @abstractmethod
    async def shutdown(self) -> None:
        pass

    @abstractmethod
    async def process_resume_task(  # type: ignore[misc]
        file_bytes_b64: str, file_name: str, application_id: int
    ) -> None:
        pass
