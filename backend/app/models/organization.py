from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseTable


class Organization(BaseTable):
    __tablename__ = "organizations"

    account_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    address: Mapped[str] = mapped_column(Text, nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    linkedin: Mapped[str | None] = mapped_column(String(255), nullable=True)
    photo: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    owner = relationship("User", back_populates="organization")

    interviews = relationship(
        "CustomInterview",
        back_populates="organization",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Organization(name='{self.account_id}')>"
