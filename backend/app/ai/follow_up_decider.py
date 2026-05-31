from app.ai.prompts import follow_up_decider_prompt
from app.ai.schema import FollowUpDeciderRequest, FollowUpDeciderResponse
from app.exceptions.ai import AIError
from app.interfaces.base_agent import BaseAgent
from app.interfaces.llm_provider import LLMProviderInterface
from app.logger import get_logger

logger = get_logger(__name__)

_FALLBACK = FollowUpDeciderResponse(needs_followup=False, followup_question=None)


class FollowUpDecider(BaseAgent[FollowUpDeciderRequest, FollowUpDeciderResponse]):
    def __init__(self, llm_provider: LLMProviderInterface):
        super().__init__(
            llm_provider=llm_provider,
            prompt=follow_up_decider_prompt,
            output_model=FollowUpDeciderResponse,
        )

    async def evaluate(self, req: FollowUpDeciderRequest) -> FollowUpDeciderResponse:
        try:
            return await super().evaluate(req)
        except AIError as e:
            logger.error("Follow-up decision failed: %s", e.detail)
            return _FALLBACK
        except Exception as e:
            logger.error("Unexpected error during follow-up decision: %s", str(e), exc_info=True)
            return _FALLBACK
