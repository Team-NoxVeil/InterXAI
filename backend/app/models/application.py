from datetime import datetime
from enum import StrEnum

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseTable


class InterviewStatus(StrEnum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    CHEATED = "cheated"
    ONGOING = "ongoing"


class CurrentRound(StrEnum):
    QUESTIONS = "questions"
    DSA = "dsa"
    RESUME = "resume"


class Application(BaseTable):
    __tablename__ = "applications"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    interview_id: Mapped[int] = mapped_column(
        ForeignKey("custom_interviews.id", ondelete="CASCADE"), nullable=False
    )
    resume: Mapped[str | None] = mapped_column(String(255), nullable=True)
    extracted_resume: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
    score: Mapped[float] = mapped_column(Float, default=0)
    shortlisting_decision: Mapped[bool] = mapped_column(Boolean, default=False)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)

    interview = relationship(
        "CustomInterview", back_populates="applications", foreign_keys=[interview_id]
    )
    sessions = relationship(
        "InterviewSession",
        back_populates="application",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Application(user_id={self.user_id}, interview_id={self.interview_id})>"


class InterviewSession(BaseTable):
    __tablename__ = "interview_sessions"

    application_id: Mapped[int] = mapped_column(
        ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    start_time: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, server_default=func.now()
    )
    end_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    current_round: Mapped[str] = mapped_column(String(20), default=CurrentRound.QUESTIONS.value)
    current_question_index: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(20), default=InterviewStatus.SCHEDULED.value)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    recommendation: Mapped[str | None] = mapped_column(String(50), nullable=True)
    strengths: Mapped[str | None] = mapped_column(Text, nullable=True)

    application = relationship("Application", back_populates="sessions")
    interactions = relationship(
        "Interaction",
        back_populates="session",
        cascade="all, delete-orphan",
        foreign_keys="Interaction.session_id",
    )
    dsa_sessions = relationship(
        "DsaInteraction",
        back_populates="session",
        cascade="all, delete-orphan",
        foreign_keys="DsaInteraction.session_id",
    )
    resume_conversations = relationship(
        "ResumeConversation",
        back_populates="session",
        cascade="all, delete-orphan",
        foreign_keys="ResumeConversation.session_id",
    )

    def __repr__(self) -> str:
        return f"<InterviewSession(application_id={self.application_id}, status='{self.status}')>"
