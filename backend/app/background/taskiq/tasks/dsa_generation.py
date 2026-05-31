import json

from sqlalchemy import select

from app.ai.dsa_generator import DsaQuestionGenerator
from app.ai.lite_llm import LiteLLMProvider
from app.ai.schema import DsaGenerationRequest, DsaGenerationResponse, TestCase
from app.background.taskiq.taskiq import broker
from app.database import AsyncSessionLocal
from app.logger import get_logger
from app.models.dsa_question import DsaQuestion
from app.utils.piston_client import PistonClient

logger = get_logger(__name__)


async def _validate_cases(
    cases: list[TestCase],
    solution: str,
    time_limit_ms: int,
    label: str,
    problem_name: str,
) -> bool:
    """
    Run `solution` against EACH case independently. Return True iff every case
    produces expected_stdout (after normalisation). One crash does not affect others.
    """
    client = PistonClient()

    for idx, case in enumerate(cases, 1):
        result = await client.execute(
            source_code=solution,
            language="python",
            stdin=case.stdin,
            run_timeout_ms=time_limit_ms,
        )

        if not result.ok:
            logger.warning(
                "Validation FAILED ('%s' %s case %d): solution exited %d. stderr=%s",
                problem_name,
                label,
                idx,
                result.exit_code,
                result.stderr[:200],
            )
            return False

        if result.stdout.strip() != case.expected_stdout.strip():
            logger.warning(
                "Validation FAILED ('%s' %s case %d): output mismatch.\nExpected: %r\nActual  : %r",
                problem_name,
                label,
                idx,
                case.expected_stdout.strip()[:200],
                result.stdout.strip()[:200],
            )
            return False

    return True


async def run_generate_dsa_question(topic: str, difficulty: str, job_roles: list[str]) -> bool:
    """
    Core logic: generate → validate every test case via Piston → save.
    Callable directly (seeder) or via the TaskIQ task below.
    Returns True if a question was saved, False otherwise.
    """
    logger.info(
        "DSA generation started: topic=%s difficulty=%s job_roles=%s",
        topic,
        difficulty,
        job_roles,
    )

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(DsaQuestion.problem_name).where(DsaQuestion.topic == topic)
        )
        existing_titles = list(result.scalars().all())

    logger.debug("Found %d existing titles for topic '%s'", len(existing_titles), topic)

    generator = DsaQuestionGenerator(llm_provider=LiteLLMProvider())
    req = DsaGenerationRequest(
        topic=topic,
        difficulty=difficulty,
        job_roles=job_roles,
        existing_titles=existing_titles,
    )

    generated: DsaGenerationResponse | None = await generator.generate(req)
    if generated is None:
        logger.error("LLM generation returned None for %s/%s", topic, difficulty)
        return False

    logger.info(
        "Generated question: '%s' — validating %d hidden + %d sample cases via Piston...",
        generated.problem_name,
        len(generated.test_cases),
        len(generated.sample_test_cases),
    )

    if not await _validate_cases(
        generated.test_cases,
        generated.sample_solution,
        generated.time_limit_ms,
        "test_cases",
        generated.problem_name,
    ):
        return False

    if not await _validate_cases(
        generated.sample_test_cases,
        generated.sample_solution,
        generated.time_limit_ms,
        "sample_test_cases",
        generated.problem_name,
    ):
        return False

    question = DsaQuestion(
        problem_name=generated.problem_name,
        topic=topic,
        difficulty=difficulty,
        description=generated.description,
        test_cases=[tc.model_dump() for tc in generated.test_cases],
        sample_test_cases=[tc.model_dump() for tc in generated.sample_test_cases],
        sample_solution=generated.sample_solution,
        time_limit_ms=generated.time_limit_ms,
        job_roles=json.dumps(job_roles),
    )

    async with AsyncSessionLocal() as session:
        session.add(question)
        await session.commit()

    logger.info("Saved question '%s' [%s/%s] ✓", generated.problem_name, topic, difficulty)
    return True


@broker.task
async def generate_dsa_question_task(topic: str, difficulty: str, job_roles: list[str]) -> bool:
    """TaskIQ-dispatchable wrapper around run_generate_dsa_question."""
    return await run_generate_dsa_question(topic, difficulty, job_roles)
