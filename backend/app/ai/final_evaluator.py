from app.ai.prompts import final_evaluation_prompt
from app.ai.schema import FinalEvaluationRequest, FinalEvaluationResponse
from app.exceptions.ai import AIError
from app.interfaces.base_agent import BaseAgent
from app.interfaces.llm_provider import LLMProviderInterface
from app.logger import get_logger

logger = get_logger(__name__)

_FALLBACK = FinalEvaluationResponse(
    overall_score=0.0,
    overall_feedback="Could not generate final evaluation due to a technical error.",
    strengths="Unable to determine.",
    recommendation="FURTHER_EVALUATION",
)


class FinalEvaluator(BaseAgent[FinalEvaluationRequest, FinalEvaluationResponse]):
    def __init__(self, llm_provider: LLMProviderInterface):
        super().__init__(
            llm_provider=llm_provider,
            prompt=final_evaluation_prompt,
            output_model=FinalEvaluationResponse,
        )

    async def evaluate(self, req: FinalEvaluationRequest) -> FinalEvaluationResponse:
        try:
            return await super().evaluate(req)
        except AIError as e:
            logger.error("Final evaluation failed: %s", e.detail)
            return _FALLBACK
        except Exception as e:
            logger.error("Unexpected error during final evaluation: %s", str(e), exc_info=True)
            return _FALLBACK
