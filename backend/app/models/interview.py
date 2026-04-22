from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseTable


class CustomInterview(BaseTable):
    __tablename__ = "custom_interviews"

    org_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    position: Mapped[str] = mapped_column(Text, nullable=False)
    experience: Mapped[str] = mapped_column(String(10), nullable=False)
    submission_deadline: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    duration: Mapped[int] = mapped_column(Integer, default=60)
    dsa_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    dev_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    resume_shortlist_score: Mapped[float] = mapped_column(Float, default=0)
    ask_questions_on_resume: Mapped[bool] = mapped_column(Boolean, default=False)

    __table_args__ = (
        CheckConstraint(
            (resume_shortlist_score >= 0) & (resume_shortlist_score <= 10),
            name="check_resume_shortlist_score_range",
        ),
        CheckConstraint(
            (dsa_score + dev_score) == 100,
            name="check_dsa_dev_score_sum",
        ),
    )

    organization = relationship("Organization", back_populates="interviews")
    questions = relationship(
        "CustomQuestion",
        back_populates="interview",
        cascade="all, delete-orphan",
        foreign_keys="CustomQuestion.interview_id",
    )
    dsa_topics = relationship(
        "DsaTopic",
        back_populates="interview",
        cascade="all, delete-orphan",
        foreign_keys="DsaTopic.interview_id",
    )
    applications = relationship(
        "Application",
        back_populates="interview",
        cascade="all, delete-orphan",
        foreign_keys="Application.interview_id",
    )

    def __repr__(self) -> str:
        return f"<CustomInterview(organization_id={self.org_id}, position='{self.position}')>"


class CustomQuestion(BaseTable):
    __tablename__ = "custom_questions"

    interview_id: Mapped[int] = mapped_column(
        ForeignKey("custom_interviews.id", ondelete="CASCADE"), nullable=False
    )
    question: Mapped[str] = mapped_column(Text, nullable=False)
    expected_answer: Mapped[str | None] = mapped_column(Text, nullable=True)

    interview = relationship(
        "CustomInterview", back_populates="questions", foreign_keys=[interview_id]
    )

    def __repr__(self) -> str:
        return f"<CustomQuestion(interview_id={self.interview_id}, question='{self.question[:50]}...')>"


class DsaTopic(BaseTable):
    __tablename__ = "dsa_topics"

    interview_id: Mapped[int] = mapped_column(
        ForeignKey("custom_interviews.id", ondelete="CASCADE"), nullable=False
    )
    topic: Mapped[str] = mapped_column(String(100), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(20), nullable=False)

    interview = relationship(
        "CustomInterview", back_populates="dsa_topics", foreign_keys=[interview_id]
    )

    def __repr__(self) -> str:
        return f"<DsaTopic(interview_id={self.interview_id}, topic='{self.topic}')>"
