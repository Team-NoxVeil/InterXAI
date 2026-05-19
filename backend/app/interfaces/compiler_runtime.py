from abc import ABC, abstractmethod

from pydantic import BaseModel, computed_field


class ExecutionResult(BaseModel):
    stdout: str
    stderr: str
    exit_code: int

    @computed_field  # type: ignore[prop-decorator]
    @property
    def ok(self) -> bool:
        return self.exit_code == 0


class CompilerRuntimeInterface(ABC):
    @abstractmethod
    async def execute(
        self,
        source_code: str,
        language: str,
        stdin: str = "",
        run_timeout_ms: int | None = None,
    ) -> ExecutionResult:
        pass

    @abstractmethod
    async def list_runtimes(self) -> list[str]:
        pass
