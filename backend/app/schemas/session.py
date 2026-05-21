from typing import Annotated, Literal

from pydantic import BaseModel, Field


class HeartbeatResponse(BaseModel):
    status: str


class AnswerRequest(BaseModel):
    answer: str


class DsaRunRequest(BaseModel):
    source_code: str
    language: str
    stdin: str = ""


class DsaRunResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int


class DsaSubmitRequest(BaseModel):
    source_code: str
    language: str


class DsaCaseResult(BaseModel):
    case: int
    status: str  # passed | failed | error
    expected: str
    actual: str


class CustomQuestionPayload(BaseModel):
    type: Literal["custom"] = "custom"
    interaction_id: int
    question: str


class DsaQuestionPayload(BaseModel):
    type: Literal["dsa"] = "dsa"
    interaction_id: int
    problem_name: str
    description: str
    sample_test_cases: list[dict[str, str]] | None = None
    time_limit_ms: int


class ResumeQuestionPayload(BaseModel):
    type: Literal["resume"] = "resume"
    question_id: int
    question: str


QuestionPayload = Annotated[
    CustomQuestionPayload | DsaQuestionPayload | ResumeQuestionPayload,
    Field(discriminator="type"),
]


class InterviewStateResponse(BaseModel):
    """Returned by /interviews/{id}/start and every /sessions/{id}/... mutation.

    `question` is None only when `completed=true`. `round` reflects the
    server-side current_round on the session at the moment of the response.
    """

    session_id: int
    round: str
    completed: bool
    question: QuestionPayload | None


class DsaSubmitResponse(BaseModel):
    case_results: list[DsaCaseResult]
    score: float
    next_state: InterviewStateResponse
