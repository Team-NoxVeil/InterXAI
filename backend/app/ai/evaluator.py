from app.ai.prompts import evaluation_prompt
from app.ai.schema import EvaluationRequest, EvaluationResponse
from app.exceptions.ai import AIError
from app.interfaces.base_agent import BaseAgent
from app.interfaces.llm_provider import LLMProviderInterface
from app.logger import get_logger

logger = get_logger(__name__)

_FALLBACK = EvaluationResponse(
    score=0.0,
    feedback="Could not evaluate automatically due to a technical error.",
    reasoning="A technical error occurred during AI evaluation.",
)


class Evaluator(BaseAgent[EvaluationRequest, EvaluationResponse]):
    def __init__(self, llm_provider: LLMProviderInterface):
        super().__init__(
            llm_provider=llm_provider,
            prompt=evaluation_prompt,
            output_model=EvaluationResponse,
        )

    async def evaluate(self, req: EvaluationRequest) -> EvaluationResponse:
        try:
            result = await super().evaluate(req)

            if result.score < 0 or result.score > 10:
                logger.warning("Invalid score %s, clamping to range", result.score)
                result.score = max(0.0, min(10.0, result.score))

            return result
        except AIError as e:
            logger.error("Answer evaluation failed: %s", e.detail)
            return _FALLBACK
        except Exception as e:
            logger.error("Unexpected error during answer evaluation: %s", str(e), exc_info=True)
            return _FALLBACK
