from app.background.taskiq.taskiq import broker
from app.background.taskiq.tasks import (
    dsa_execution,
    dsa_generation,
    grading,
    resume_generation,
    resume_processing,
)
from app.interfaces.background_worker import BackgroundWorkerInterface


class TaskiqWorker(BackgroundWorkerInterface):
    async def startup(self) -> None:
        await broker.startup()

    async def shutdown(self) -> None:
        await broker.shutdown()

    async def process_resume_task(
        self, file_bytes_b64: str, file_name: str, application_id: int
    ) -> None:
        await resume_processing.process_resume_task.kiq(file_bytes_b64, file_name, application_id)

    async def generate_dsa_question_task(
        self, topic: str, difficulty: str, job_roles: list[str]
    ) -> None:
        await dsa_generation.generate_dsa_question_task.kiq(topic, difficulty, job_roles)

    async def assign_dsa_questions_task(self, session_id: int) -> None:
        await dsa_execution.assign_dsa_questions_task.kiq(session_id)

    async def run_code_task(self, source_code: str, language: str, stdin: str) -> None:
        await dsa_execution.run_code_task.kiq(source_code, language, stdin)

    async def evaluate_submission_task(
        self, dsa_interaction_id: int, source_code: str, language: str
    ) -> None:
        await dsa_execution.evaluate_submission_task.kiq(dsa_interaction_id, source_code, language)

    async def generate_resume_questions_task(self, session_id: int) -> None:
        await resume_generation.generate_resume_questions_task.kiq(session_id)

    async def grade_interaction_task(self, interaction_id: int) -> None:
        await grading.grade_interaction_task.kiq(interaction_id)

    async def grade_session_task(self, session_id: int) -> None:
        await grading.grade_session_task.kiq(session_id)


worker = TaskiqWorker()
