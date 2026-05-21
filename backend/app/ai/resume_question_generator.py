from app.ai.prompts import resume_question_generation_prompt
from app.ai.schema import ResumeQuestionRequest, ResumeQuestionResponse
from app.exceptions.ai import AIError
from app.interfaces.base_agent import BaseAgent
from app.interfaces.llm_provider import LLMProviderInterface
from app.logger import get_logger

logger = get_logger(__name__)


class ResumeQuestionGenerator(BaseAgent[ResumeQuestionRequest, ResumeQuestionResponse]):
    def __init__(self, llm_provider: LLMProviderInterface) -> None:
        super().__init__(
            llm_provider=llm_provider,
            prompt=resume_question_generation_prompt,
            output_model=ResumeQuestionResponse,
        )

    async def generate(self, req: ResumeQuestionRequest) -> ResumeQuestionResponse | None:
        try:
            return await super().evaluate(req)
        except AIError as e:
            logger.error("Resume question generation failed: %s", e.detail)
            return None
        except Exception as e:
            logger.error(
                "Unexpected error during resume question generation: %s", str(e), exc_info=True
            )
            return None
