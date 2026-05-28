from datetime import datetime

from pydantic import BaseModel, model_validator


class CustomQuestionCreate(BaseModel):
    question: str
    expected_answer: str


class DsaTopicCreate(BaseModel):
    topic: str
    difficulty: str


class CustomInterviewCreate(BaseModel):
    description: str
    position: str
    experience: str
    submission_deadline: datetime
    start_time: datetime
    end_time: datetime
    duration: int = 60
    dsa_score: int = 50
    dev_score: int = 50
    resume_shortlist_score: float = 0
    ask_questions_on_resume: bool = False

    questions: list[CustomQuestionCreate] = []
    dsa_topics: list[DsaTopicCreate] = []

    @model_validator(mode="after")
    def validate_times_and_scores(self) -> "CustomInterviewCreate":
        tz = self.start_time.tzinfo
        now = datetime.now(tz)

        if self.start_time <= now:
            raise ValueError("start_time must be in the future")
        if self.end_time <= now:
            raise ValueError("end_time must be in the future")
        if self.submission_deadline <= now:
            raise ValueError("submission_deadline must be in the future")

        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")

        if self.dsa_score is not None or self.dev_score is not None:
            dsa = self.dsa_score or 0
            dev = self.dev_score or 0
            if dsa + dev != 100:
                raise ValueError("The sum of dsa_score and dev_score must be exactly 100")

        return self


class CustomQuestionResponse(CustomQuestionCreate):
    id: int
    interview_id: int

    class Config:
        from_attributes = True


class DsaTopicResponse(DsaTopicCreate):
    id: int
    interview_id: int

    class Config:
        from_attributes = True


class CustomInterviewResponse(CustomInterviewCreate):
    id: int
    org_id: int
    questions: list[CustomQuestionResponse] = []  # type: ignore[assignment]
    dsa_topics: list[DsaTopicResponse] = []  # type: ignore[assignment]

    class Config:
        from_attributes = True


class CustomInterviewBasicResponse(BaseModel):
    id: int
    org_id: int
    description: str
    position: str
    experience: str
    submission_deadline: datetime
    start_time: datetime
    end_time: datetime

    class Config:
        from_attributes = True


class AppliedInterviewResponse(CustomInterviewBasicResponse):
    status: str
