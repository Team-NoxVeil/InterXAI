from typing import Any

from sqlalchemy import Integer, String, Text, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseTable

# Use JSONB on PostgreSQL, and standard JSON on SQLite/other dialects
JSONB_TYPE = JSON().with_variant(JSONB, "postgresql")


class DsaQuestion(BaseTable):
    __tablename__ = "dsa_questions"

    problem_name: Mapped[str] = mapped_column(String(255), nullable=False)
    topic: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    difficulty: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    # Each entry: {"stdin": str, "expected_stdout": str}. Multi-line values use "\n".
    test_cases: Mapped[list[dict[str, Any]]] = mapped_column(JSONB_TYPE, nullable=False)
    sample_test_cases: Mapped[list[dict[str, Any]] | None] = mapped_column(JSONB_TYPE, nullable=True)


    sample_solution: Mapped[str | None] = mapped_column(Text, nullable=True)
    time_limit_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=5000)

    job_roles: Mapped[str | None] = mapped_column(Text, nullable=True)
    times_served: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    def __repr__(self) -> str:
        return (
            f"<DsaQuestion(name='{self.problem_name}', "
            f"topic='{self.topic}', difficulty='{self.difficulty}')>"
        )
