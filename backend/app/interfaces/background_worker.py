from abc import ABC, abstractmethod


class BackgroundWorkerInterface(ABC):
    @abstractmethod
    async def startup(self) -> None:
        pass

    @abstractmethod
    async def shutdown(self) -> None:
        pass

    @abstractmethod
    async def process_resume_task(
        self, file_bytes_b64: str, file_name: str, application_id: int
    ) -> None:
        pass

    @abstractmethod
    async def generate_dsa_question_task(
        self, topic: str, difficulty: str, job_roles: list[str]
    ) -> None:
        pass

    @abstractmethod
    async def assign_dsa_questions_task(self, session_id: int) -> None:
        pass

    @abstractmethod
    async def run_code_task(self, source_code: str, language: str, stdin: str) -> None:
        pass

    @abstractmethod
    async def evaluate_submission_task(
        self, dsa_interaction_id: int, source_code: str, language: str
    ) -> None:
        pass

    @abstractmethod
    async def generate_resume_questions_task(self, session_id: int) -> None:
        pass

    @abstractmethod
    async def grade_interaction_task(self, interaction_id: int) -> None:
        pass

    @abstractmethod
    async def grade_session_task(self, session_id: int) -> None:
        pass

    @abstractmethod
    async def send_email_task(self, to_email: list[str], subject: str, body: str) -> None:
        pass
