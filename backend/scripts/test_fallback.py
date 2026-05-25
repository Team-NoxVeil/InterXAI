import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.ai.lite_llm import LiteLLMProvider
from app.ai.resume_evaluator import ResumeEvaluator
from app.ai.schema import ResumeEvaluatorRequest
from app.config import settings
from app.exceptions.ai import AIError, AIProviderError, AITimeoutError

SAMPLE = ResumeEvaluatorRequest(
    resume_text="Jane Doe — 5 years Python, FastAPI, PostgreSQL.",
    job_title="Backend Engineer",
    job_description="Build scalable REST APIs using Python and FastAPI.",
    experience="3+ years",
)


async def run() -> None:
    print(f"Primary model:  {settings.LLM_MODEL_NAME}")
    print(f"Fallback model: {settings.FALLBACK_LLM_PROVIDER}")
    print()

    # LiteLLM reads provider keys from env vars at call time, overriding the api_key kwarg.
    # Poison GROQ_API_KEY so the primary fails, and map LITELLM_API_KEY → GEMINI_API_KEY
    # so the fallback can authenticate (LiteLLM looks for GEMINI_API_KEY for gemini/ models).
    os.environ["GROQ_API_KEY"] = "invalid-key-forced-failure"
    os.environ["GEMINI_API_KEY"] = settings.LITELLM_API_KEY
    primary = LiteLLMProvider(
        model_name=settings.LLM_MODEL_NAME, api_key="invalid-key-forced-failure"
    )
    fallback = LiteLLMProvider(
        model_name=settings.FALLBACK_LLM_PROVIDER, api_key=settings.LITELLM_API_KEY
    )

    evaluator = ResumeEvaluator(llm_provider=primary)

    try:
        print("Calling primary provider with invalid key — expecting failure...")
        await evaluator.evaluate(SAMPLE)
        print("FAIL: primary should have raised but returned a result.")
        sys.exit(1)
    except AIError as e:
        # LiteLLM maps Groq's 401 to BadRequestError, which lands in the AIError
        # catch-all. Production code catches AIProviderError/AITimeoutError for outages;
        # this script catches the base class to demonstrate the fallback path.
        print(f"Primary failed as expected ({type(e).__name__}): {e.detail}")
        print("Fallback triggered — calling Gemini...")

    fallback_evaluator = ResumeEvaluator(llm_provider=fallback)
    res = await fallback_evaluator.evaluate(SAMPLE)

    print()
    print("Fallback succeeded.")
    print(f"  Score:    {res.score}")
    print(f"  Decision: {res.shortlisting_decision}")
    print(f"  Feedback: {res.feedback[:100]}")


if __name__ == "__main__":
    asyncio.run(run())
