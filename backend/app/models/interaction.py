from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseTable


class Interaction(BaseTable):
    __tablename__ = "interactions"

    session_id: Mapped[int] = mapped_column(
        ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False
    )
    custom_question_id: Mapped[int] = mapped_column(
        ForeignKey("custom_questions.id", ondelete="CASCADE"), nullable=False
    )
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)

    session = relationship(
        "InterviewSession", back_populates="interactions", foreign_keys=[session_id]
    )
    custom_question = relationship("CustomQuestion")
    follow_up_questions = relationship(
        "FollowUpQuestion",
        back_populates="interaction",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Interaction(session_id={self.session_id}, question_id={self.custom_question_id})>"


class FollowUpQuestion(BaseTable):
    __tablename__ = "follow_up_questions"

    interaction_id: Mapped[int] = mapped_column(
        ForeignKey("interactions.id", ondelete="CASCADE"), nullable=False
    )
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str | None] = mapped_column(Text, nullable=True)

    interaction = relationship(
        "Interaction", back_populates="follow_up_questions", foreign_keys=[interaction_id]
    )

    def __repr__(self) -> str:
        return f"<FollowUpQuestion(interaction_id={self.interaction_id}, question='{self.question[:50]}...')>"


class DsaInteraction(BaseTable):
    __tablename__ = "dsa_interactions"

    session_id: Mapped[int | None] = mapped_column(
        ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=True
    )
    topic_id: Mapped[int | None] = mapped_column(
        ForeignKey("dsa_topics.id", ondelete="CASCADE"), nullable=True
    )
    question: Mapped[str | None] = mapped_column(Text, nullable=True)
    code: Mapped[str | None] = mapped_column(Text, nullable=True)
    score: Mapped[float | None] = mapped_column(Float, nullable=True)

    session = relationship(
        "InterviewSession", back_populates="dsa_sessions", foreign_keys=[session_id]
    )
    topic = relationship("DsaTopic", foreign_keys=[topic_id])

    def __repr__(self) -> str:
        return f"<DsaInteraction(session_id={self.session_id}, topic_id={self.topic_id})>"


class ResumeConversation(BaseTable):
    __tablename__ = "resume_conversations"

    session_id: Mapped[int] = mapped_column(
        ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False
    )
    time: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, server_default=func.now()
    )
    score: Mapped[float] = mapped_column(Float, default=0)
    feedback: Mapped[str] = mapped_column(Text, nullable=True)

    session = relationship(
        "InterviewSession", back_populates="resume_conversations", foreign_keys=[session_id]
    )

    def __repr__(self) -> str:
        return f"<ResumeConversation(session_id={self.session_id})>"


class ResumeQuestion(BaseTable):
    __tablename__ = "resume_questions"

    conversation_id: Mapped[int] = mapped_column(
        ForeignKey("resume_conversations.id", ondelete="CASCADE"), nullable=False
    )
    question: Mapped[str] = mapped_column(Text, default="Default question text")
    answer: Mapped[str | None] = mapped_column(Text, nullable=True)

    conversation = relationship("ResumeConversation", foreign_keys=[conversation_id])

    def __repr__(self) -> str:
        return f"<ResumeQuestion(conversation_id={self.conversation_id}, id={self.id})>"
