from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.background.taskiq.taskiq import broker
from app.database import AsyncSessionLocal
from app.logger import get_logger
from app.models.application import Application, InterviewSession
from app.models.dsa_question import DsaQuestion
from app.models.interaction import DsaInteraction
from app.models.interview import CustomInterview
from app.utils.piston_client import PistonClient

logger = get_logger(__name__)


# ── Job 1: Assign DSA questions to an interview session ──────────────────────


async def run_assign_dsa_questions(session_id: int) -> list[int]:
    """
    For each DsaTopic in the session's interview, pick a matching DsaQuestion
    from the DB and create a DsaInteraction with blank code/score.

    Returns list of created DsaInteraction IDs.
    """
    logger.info("Assigning DSA questions for session=%d", session_id)

    async with AsyncSessionLocal() as db:
        # session → application → interview (with dsa_topics)
        session = await db.get(InterviewSession, session_id)
        if not session:
            logger.error("InterviewSession %d not found", session_id)
            return []

        app = await db.get(Application, session.application_id)
        if not app:
            logger.error("Application %d not found", session.application_id)
            return []

        result = await db.execute(
            select(CustomInterview)
            .options(selectinload(CustomInterview.dsa_topics))
            .where(CustomInterview.id == app.interview_id)
        )
        interview = result.scalar_one_or_none()
        if not interview:
            logger.error("Interview %d not found", app.interview_id)
            return []

        created_ids: list[int] = []

        for topic in interview.dsa_topics:
            q_result = await db.execute(
                select(DsaQuestion)
                .where(
                    DsaQuestion.topic == topic.topic,
                    DsaQuestion.difficulty == topic.difficulty,
                )
                .order_by(DsaQuestion.times_served.asc())
                .limit(1)
            )
            question = q_result.scalar_one_or_none()

            if not question:
                logger.warning(
                    "No DsaQuestion found for topic=%s difficulty=%s — skipping",
                    topic.topic,
                    topic.difficulty,
                )
                continue

            interaction = DsaInteraction(
                session_id=session_id,
                topic_id=topic.id,
                question_id=question.id,
            )
            db.add(interaction)
            question.times_served += 1

        await db.commit()

        # Fetch the created interaction IDs
        id_result = await db.execute(
            select(DsaInteraction.id).where(DsaInteraction.session_id == session_id)
        )
        created_ids = list(id_result.scalars().all())

    logger.info("Assigned %d DSA questions for session %d", len(created_ids), session_id)
    return created_ids


@broker.task
async def assign_dsa_questions_task(session_id: int) -> list[int]:
    return await run_assign_dsa_questions(session_id)


# ── Job 2: Run code (simple execution, no DB) ────────────────────────────────


async def run_code(
    source_code: str, language: str, stdin: str = "", run_timeout_ms: int | None = None
) -> dict[str, Any]:
    """
    Execute code via Piston and return stdout/stderr/exit_code.
    """
    client = PistonClient()
    result = await client.execute(
        source_code=source_code,
        language=language,
        stdin=stdin,
        run_timeout_ms=run_timeout_ms,
    )
    return {
        "stdout": result.stdout,
        "stderr": result.stderr,
        "exit_code": result.exit_code,
    }


@broker.task
async def run_code_task(
    source_code: str, language: str, stdin: str = "", run_timeout_ms: int | None = None
) -> dict[str, Any]:
    return await run_code(source_code, language, stdin, run_timeout_ms)


# ── Job 3: Evaluate DSA submission ───────────────────────────────────────────


async def run_evaluate_submission(
    dsa_interaction_id: int, source_code: str, language: str
) -> list[dict[str, Any]]:
    """
    Run candidate code INDEPENDENTLY against each entry in question.test_cases.
    Each test case is one Piston invocation; a crash on one case does not affect
    the others. Per-case time limit comes from question.time_limit_ms.

    Returns per-case results:
        [{"case": 1, "status": "passed"|"failed"|"error",
          "expected": str, "actual": str}, ...]
    """
    logger.info("Evaluating submission for dsa_interaction=%d", dsa_interaction_id)

    async with AsyncSessionLocal() as db:
        interaction = await db.get(DsaInteraction, dsa_interaction_id)
        if not interaction:
            logger.error("DsaInteraction %d not found", dsa_interaction_id)
            return []

        question = await db.get(DsaQuestion, interaction.question_id)
        if not question:
            logger.error("DsaQuestion not found for interaction %d", dsa_interaction_id)
            return []

        cases: list[dict[str, Any]] = question.test_cases or []
        client = PistonClient()
        case_results: list[dict[str, Any]] = []

        for idx, case in enumerate(cases, 1):
            stdin = case.get("stdin", "")
            expected = case.get("expected_stdout", "").strip()

            result = await client.execute(
                source_code=source_code,
                language=language,
                stdin=stdin,
                run_timeout_ms=question.time_limit_ms,
            )

            if result.exit_code != 0:
                case_results.append(
                    {
                        "case": idx,
                        "status": "error",
                        "expected": expected,
                        "actual": (result.stderr or "Runtime error")[:300],
                    }
                )
                continue

            actual = result.stdout.strip()
            case_results.append(
                {
                    "case": idx,
                    "status": "passed" if actual == expected else "failed",
                    "expected": expected,
                    "actual": actual,
                }
            )

        passed = sum(1 for c in case_results if c["status"] == "passed")
        total = len(case_results)
        score = (passed / total) * 10.0 if total > 0 else 0.0

        interaction.code = source_code
        interaction.language = language
        interaction.score = score
        await db.commit()

        logger.info(
            "Submission evaluated: %d/%d passed (score=%.1f) for interaction %d",
            passed,
            total,
            score,
            dsa_interaction_id,
        )

    return case_results


@broker.task
async def evaluate_submission_task(
    dsa_interaction_id: int, source_code: str, language: str
) -> list[dict[str, Any]]:
    return await run_evaluate_submission(dsa_interaction_id, source_code, language)
