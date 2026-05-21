from app.ai.prompts import dsa_generation_prompt
from app.ai.schema import DsaGenerationRequest, DsaGenerationResponse
from app.exceptions.ai import AIError
from app.interfaces.base_agent import BaseAgent
from app.interfaces.llm_provider import LLMProviderInterface
from app.logger import get_logger

logger = get_logger(__name__)


class DsaQuestionGenerator(BaseAgent[DsaGenerationRequest, DsaGenerationResponse]):
    def __init__(self, llm_provider: LLMProviderInterface) -> None:
        super().__init__(
            llm_provider=llm_provider,
            prompt=dsa_generation_prompt,
            output_model=DsaGenerationResponse,
        )

    async def generate(self, req: DsaGenerationRequest) -> DsaGenerationResponse | None:
        try:
            return await super().evaluate(req)
        except AIError as e:
            logger.error("DSA generation failed [%s/%s]: %s", req.topic, req.difficulty, e.detail)
            return None
        except Exception as e:
            logger.error("Unexpected error during DSA generation: %s", str(e), exc_info=True)
            return None
