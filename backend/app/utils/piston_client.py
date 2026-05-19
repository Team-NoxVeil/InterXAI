"""
Piston API client for local code execution.
Docs: https://github.com/engineer-man/piston#api-v2
"""

from typing import Any

import httpx

from app.config import settings
from app.interfaces.compiler_runtime import CompilerRuntimeInterface, ExecutionResult
from app.logger import get_logger

logger = get_logger(__name__)

# Supported language aliases → Piston runtime name.
# Run GET /api/v2/runtimes on your local instance to see what's installed.
LANGUAGE_ALIASES: dict[str, str] = {
    # Python
    "python": "python",
    "python3": "python",
    "py": "python",
    # C / C++ (both via gcc runtime)
    "c": "c",
    "cpp": "c++",
    "c++": "c++",
    # JVM
    "java": "java",
    # JavaScript / TypeScript
    "javascript": "javascript",
    "js": "javascript",
    "node": "javascript",
    "typescript": "typescript",
    "ts": "typescript",
    # Systems / scripting
    "go": "go",
    "golang": "go",
    "bash": "bash",
    "sh": "bash",
    # C# via Mono
    "csharp": "csharp",
    "c#": "csharp",
    "cs": "csharp",
}


class PistonClient(CompilerRuntimeInterface):
    """
    Thin async wrapper around the Piston /api/v2/execute endpoint.

    Piston is synchronous — it runs the code and returns the full
    stdout/stderr in a single response. No polling needed.
    """

    def __init__(self) -> None:
        self.base_url = settings.PISTON_URL.rstrip("/")

    async def execute(
        self,
        source_code: str,
        language: str,
        stdin: str = "",
        run_timeout_ms: int | None = None,
    ) -> ExecutionResult:
        runtime = LANGUAGE_ALIASES.get(language.lower(), language.lower())

        payload: dict[str, Any] = {
            "language": runtime,
            "version": "*",
            "files": [{"content": source_code}],
            "stdin": stdin,
        }
        if run_timeout_ms is not None:
            payload["run_timeout"] = run_timeout_ms

        logger.debug(
            "Piston execute: language=%s stdin_len=%d run_timeout_ms=%s",
            runtime,
            len(stdin),
            run_timeout_ms,
        )

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v2/execute",
                json=payload,
                timeout=30.0,
            )
            response.raise_for_status()

        run = response.json().get("run", {})
        # `code` is null when Piston kills the process via signal (e.g. timeout).
        exit_code = run.get("code")
        if exit_code is None:
            exit_code = -1

        return ExecutionResult(
            stdout=run.get("stdout", "") or "",
            stderr=run.get("stderr", "") or "",
            exit_code=exit_code,
        )

    async def list_runtimes(self) -> list[str]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v2/runtimes",
                timeout=10.0,
            )
            response.raise_for_status()
            return [r["language"] for r in response.json()]


def get_piston_client() -> CompilerRuntimeInterface:
    return PistonClient()
