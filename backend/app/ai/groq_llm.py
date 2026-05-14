"""
Groq LLM Provider for InterXAI
"""

from typing import Any

from langchain_core.output_parsers import BaseOutputParser
from langchain_core.prompts.base import BasePromptTemplate
from langchain_groq import ChatGroq

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


class GroqProvider(LLMProviderInterface):
    def __init__(
        self, model_name: str = "llama-3.3-70b-versatile", api_key: str = settings.GROQ_API_KEY
    ):
        self.model_name = model_name
        self.api_key = api_key

        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable not set")

        self.client = ChatGroq(
            model=model_name,
            api_key=self.api_key,
            temperature=0.7,
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

        except Exception as e:
            error_msg = str(e).lower()

            if "timeout" in error_msg:
                logger.error("Groq Timeout: %s", str(e))
                raise AITimeoutError(f"Generation timed out: {str(e)}") from e

            elif "rate" in error_msg or "limit" in error_msg:
                logger.error("Groq Rate Limit Exceeded: %s", str(e))
                raise AIRateLimitError(f"Rate limit exceeded: {str(e)}") from e

            elif "auth" in error_msg or "api key" in error_msg:
                logger.error("Groq Authentication Failed: %s", str(e))
                raise AIAuthenticationError(f"Authentication failed: {str(e)}") from e

            elif "context" in error_msg or "token" in error_msg:
                logger.error("Groq Context Window Exceeded: %s", str(e))
                raise AIContextWindowError(f"Context window exceeded: {str(e)}") from e

            elif "api" in error_msg:
                logger.error("Groq API Error: %s", str(e))
                raise AIProviderError(f"Provider API error: {str(e)}") from e

            else:
                logger.error("Error generating Groq response: %s", str(e), exc_info=True)
                raise AIError(f"Unexpected generation error: {str(e)}") from e
