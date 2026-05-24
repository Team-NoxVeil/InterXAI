from typing import Any

import anthropic
from langchain_anthropic import ChatAnthropic
from langchain_core.output_parsers import BaseOutputParser
from langchain_core.prompts.base import BasePromptTemplate
from pydantic import SecretStr

from app.config import settings
from app.exceptions.ai import (
    AIAuthenticationError,
    AIContextWindowError,
    AIError,
    AIProviderError,
    AIRateLimitError,
    AITimeoutError,
)
from app.interfaces.llm_provider import LLMProviderInterface
from app.logger import get_logger

logger = get_logger(__name__)


class AnthropicProvider(LLMProviderInterface):
    def __init__(
        self,
        model_name: str = settings.ANTHROPIC_MODEL_NAME,
        api_key: str = settings.ANTHROPIC_API_KEY,
    ):
        self.client = ChatAnthropic(
            model_name=model_name,
            api_key=SecretStr(api_key),
            timeout=None,
            stop=None,
        )

    async def generate_response(  # type: ignore[override]
        self,
        prompt: BasePromptTemplate[Any],
        variables: dict[str, Any],
        output_parser: BaseOutputParser[Any],
    ) -> Any:
        try:
            chain = prompt | self.client | output_parser

            if hasattr(output_parser, "get_format_instructions"):
                variables["format_instructions"] = output_parser.get_format_instructions()

            return await chain.ainvoke(variables)

        except anthropic.APITimeoutError as e:
            logger.error("Anthropic Timeout: %s", str(e))
            raise AITimeoutError(f"Generation timed out: {str(e)}") from e

        except anthropic.RateLimitError as e:
            logger.error("Anthropic Rate Limit: %s", str(e))
            raise AIRateLimitError(f"Rate limit exceeded: {str(e)}") from e

        except anthropic.AuthenticationError as e:
            logger.error("Anthropic Auth Failed: %s", str(e))
            raise AIAuthenticationError(f"Authentication failed: {str(e)}") from e

        except anthropic.BadRequestError as e:
            logger.error("Anthropic Bad Request: %s", str(e))
            raise AIContextWindowError(f"Context window exceeded: {str(e)}") from e

        except anthropic.APIError as e:
            logger.error("Anthropic API Error: %s", str(e))
            raise AIProviderError(f"Provider API error: {str(e)}") from e

        except Exception as e:
            logger.error("Anthropic unexpected error: %s", str(e), exc_info=True)
            raise AIError(f"Unexpected generation error: {str(e)}") from e
