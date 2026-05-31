from pydantic import BaseModel, Field

# Resume Evaluator


class ResumeEvaluatorRequest(BaseModel):
    resume_text: str = Field(description="The full text of the candidate's resume")
    job_title: str = Field(description="The title of the job applied for")
    job_description: str = Field(description="The description of the job")
    experience: str = Field(description="The required years of experience")


class ResumeEvaluatorResponse(BaseModel):
    extracted_standardized_resume: str = Field(
        description="The standardized resume extracted from the resume text"
    )
    score: float = Field(
        description="The score of the extracted resume based on the job description"
    )
    shortlisting_decision: bool = Field(
        description="Decision on whether to shortlist the candidate based on the extracted resume"
    )
    feedback: str = Field(description="Feedback on the extracted resume")


# Answer Evaluator


class EvaluationRequest(BaseModel):
    position: str = Field(description="The job position being interviewed for")
    experience: str = Field(description="The required experience level")
    conversation_context: str = Field(description="The full conversation history so far")
    question: str = Field(
        description="The main question asked to the candidate; subsequent questions in the "
        "conversation history are follow-ups"
    )
    expected_answer: str = Field(description="The expected answer for the question")


class EvaluationResponse(BaseModel):
    score: float = Field(description="Score from 1.0 to 10.0")
    feedback: str = Field(description="Constructive feedback on the answer")
    reasoning: str = Field(description="Reasoning behind the assigned score")


# Follow-Up Decider


class FollowUpDeciderRequest(BaseModel):
    position: str = Field(description="The job position being interviewed for")
    experience: str = Field(description="The required experience level")
    conversation_context: str = Field(description="The full conversation history so far")
    expected_answer: str = Field(description="The expected answer for the question")


class FollowUpDeciderResponse(BaseModel):
    needs_followup: bool = Field(description="Whether a follow-up question is needed")
    followup_question: str | None = Field(
        default=None, description="The follow-up question to ask, if any"
    )


# Final Evaluator


class FinalEvaluationRequest(BaseModel):
    position: str = Field(description="The job position being interviewed for")
    experience: str = Field(description="The required experience level")
    interview_history: str = Field(
        description="JSON-serialized interview history with scores and feedback per question"
    )


class FinalEvaluationResponse(BaseModel):
    overall_score: float = Field(description="Overall score from 1.0 to 10.0")
    overall_feedback: str = Field(description="Critical assessment of the full interview")
    strengths: str = Field(description="Summary of key strengths observed")
    recommendation: str = Field(description="HIRE, REJECT, or FURTHER_EVALUATION")


# DSA Question Generator


class DsaGenerationRequest(BaseModel):
    topic: str = Field(description="DSA topic (e.g. Arrays, Trees, Dynamic Programming)")
    difficulty: str = Field(description="Difficulty level: easy, medium, or hard")
    job_roles: list[str] = Field(
        description="Target job roles (e.g. ['Backend Engineer', 'Data Engineer'])"
    )
    existing_titles: list[str] = Field(
        default_factory=list,
        description="Titles of questions already generated for this topic, to avoid duplicates",
    )


class TestCase(BaseModel):
    stdin: str = Field(
        description=(
            "The full stdin payload for ONE independent run of the candidate's code. "
            "Multi-line input uses \\n inside the string."
        )
    )
    expected_stdout: str = Field(
        description=(
            "The exact expected stdout when the solution is run against this stdin. "
            "Multi-line output uses \\n inside the string."
        )
    )


class DsaGenerationResponse(BaseModel):
    problem_name: str = Field(description="Short, unique title for the problem")
    description: str = Field(
        description=(
            "Full problem statement: problem description, **Input Format** (single test case "
            "per run), **Output Format**, **Constraints**, and 2 worked examples."
        )
    )
    test_cases: list[TestCase] = Field(
        description=(
            "Hidden test suite: exactly 10 independent test cases, each with its own stdin "
            "and expected_stdout. Covers edge cases (empty/single/large/duplicate)."
        )
    )
    sample_test_cases: list[TestCase] = Field(
        description=(
            "Visible sample cases shown to the candidate: exactly 3 simple, illustrative "
            "test cases that mirror the examples in the description."
        )
    )
    sample_solution: str = Field(
        description=(
            "A correct Python 3 reference solution. Reads stdin ONCE (sys.stdin.read()), "
            "prints the answer ONCE, exits. NO loop over multiple cases — each test case "
            "runs the program independently."
        )
    )
    time_limit_ms: int = Field(
        description=(
            "Per-case execution time limit in milliseconds. Typically 5000 for easy, "
            "5000 for medium, 10000 for hard."
        )
    )


# Resume Question Generator


class ResumeQuestionRequest(BaseModel):
    extracted_standardized_resume: str = Field(
        description="The standardized resume extracted from the resume text"
    )
    job_title: str = Field(description="The job title for the position")
    job_description: str = Field(description="The job description for the position")
    experience: str = Field(description="The required years of experience")


class ResumeQA(BaseModel):
    question: str = Field(description="Resume-grounded interview question for the candidate")
    expected_answer: str = Field(
        description="A high-quality reference answer used to grade the candidate's response"
    )


class ResumeQuestionResponse(BaseModel):
    questions: list[ResumeQA] = Field(
        description="Exactly 3 resume-grounded question + expected_answer pairs"
    )
