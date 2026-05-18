from typing import Any

import groq
from langchain_core.output_parsers import BaseOutputParser
from langchain_core.prompts.base import BasePromptTemplate
from langchain_groq import ChatGroq
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


class ChatGroqProvider(LLMProviderInterface):
    def __init__(
        self,
        model_name: str = settings.CHATGROQ_MODEL_NAME,
        api_key: str | None = settings.CHATGROQ_API_KEY or None,
    ):
        self.client = ChatGroq(
            model=model_name,
            api_key=SecretStr(api_key) if api_key else None,
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

        except groq.APITimeoutError as e:
            logger.error("ChatGroq Timeout: %s", str(e))
            raise AITimeoutError(f"Generation timed out: {str(e)}") from e

        except groq.RateLimitError as e:
            logger.error("ChatGroq Rate Limit: %s", str(e))
            raise AIRateLimitError(f"Rate limit exceeded: {str(e)}") from e

        except groq.AuthenticationError as e:
            logger.error("ChatGroq Auth Failed: %s", str(e))
            raise AIAuthenticationError(f"Authentication failed: {str(e)}") from e

        except groq.BadRequestError as e:
            logger.error("ChatGroq Bad Request: %s", str(e))
            raise AIContextWindowError(f"Context window exceeded: {str(e)}") from e

        except groq.APIError as e:
            logger.error("ChatGroq API Error: %s", str(e))
            raise AIProviderError(f"Provider API error: {str(e)}") from e

        except Exception as e:
            logger.error("ChatGroq unexpected error: %s", str(e), exc_info=True)
            raise AIError(f"Unexpected generation error: {str(e)}") from e
