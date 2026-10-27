"""SQLAlchemy models for the approved data model (docs/sdlc/architecture/data-model.md).

One class per entity, mirroring the schema `backend/alembic/versions/0001_initial.py`
creates. The migration is the source of truth for the actual DDL; these models are
what application code imports (`from app.models import Document`, etc.) -- the
development sprint's tickets build their handlers on top of them rather than
rediscovering the schema from the architecture doc each time.
"""

import uuid
from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    BigInteger,
    DateTime,
    ForeignKey,
    Integer,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import CITEXT, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

# gemini-embedding-001's output size (see data-model.md: chunks.embedding).
EMBEDDING_DIM = 3072


def _uuid_pk() -> Mapped[uuid.UUID]:
    return mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = _uuid_pk()
    email: Mapped[str] = mapped_column(CITEXT, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    documents: Mapped[list["Document"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )
    chat_sessions: Mapped[list["ChatSession"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )
    usage_counter: Mapped["UsageCounter | None"] = relationship(
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[uuid.UUID] = _uuid_pk()
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    s3_key: Mapped[str] = mapped_column(Text, nullable=False)
    file_type: Mapped[str] = mapped_column(Text, nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    # "processing" | "ready" | "failed" -- enforced by the handler that writes
    # it, not by a DB constraint, so a new status does not need a migration.
    status: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'processing'"))
    failure_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="documents")
    chunks: Mapped[list["Chunk"]] = relationship(
        back_populates="document", cascade="all, delete-orphan", passive_deletes=True
    )
    session_links: Mapped[list["SessionDocument"]] = relationship(
        back_populates="document", cascade="all, delete-orphan", passive_deletes=True
    )
    citations: Mapped[list["MessageCitation"]] = relationship(
        back_populates="document", cascade="all, delete-orphan", passive_deletes=True
    )


class Chunk(Base):
    __tablename__ = "chunks"
    __table_args__ = (
        UniqueConstraint("document_id", "chunk_index", name="uq_chunks_document_chunk_index"),
    )

    id: Mapped[uuid.UUID] = _uuid_pk()
    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # Denormalized from documents.user_id so a per-user similarity search
    # (NFR-002/NFR-004 isolation) never has to join through documents.
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[list[float]] = mapped_column(Vector(EMBEDDING_DIM), nullable=False)

    document: Mapped["Document"] = relationship(back_populates="chunks")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id: Mapped[uuid.UUID] = _uuid_pk()
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="chat_sessions")
    messages: Mapped[list["Message"]] = relationship(
        back_populates="session", cascade="all, delete-orphan", passive_deletes=True
    )
    document_links: Mapped[list["SessionDocument"]] = relationship(
        back_populates="session", cascade="all, delete-orphan", passive_deletes=True
    )


class SessionDocument(Base):
    """Which of the user's documents a chat session is scoped to.

    Deleting a session deletes its rows here (and only here); the documents
    themselves remain, exactly as DELETE /sessions/{id} promises.
    """

    __tablename__ = "session_documents"

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("chat_sessions.id", ondelete="CASCADE"), primary_key=True
    )
    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), primary_key=True
    )

    session: Mapped["ChatSession"] = relationship(back_populates="document_links")
    document: Mapped["Document"] = relationship(back_populates="session_links")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = _uuid_pk()
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("chat_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # "user" | "assistant" -- enforced by the handler, not a DB constraint.
    role: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    session: Mapped["ChatSession"] = relationship(back_populates="messages")
    citations: Mapped[list["MessageCitation"]] = relationship(
        back_populates="message", cascade="all, delete-orphan", passive_deletes=True
    )


class MessageCitation(Base):
    __tablename__ = "message_citations"

    id: Mapped[uuid.UUID] = _uuid_pk()
    message_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("messages.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    message: Mapped["Message"] = relationship(back_populates="citations")
    document: Mapped["Document"] = relationship(back_populates="citations")


class UsageCounter(Base):
    """One row per user, enforcing the document/message usage limits (NFR)."""

    __tablename__ = "usage_counters"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    document_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    total_document_bytes: Mapped[int] = mapped_column(
        BigInteger, nullable=False, server_default=text("0")
    )
    period_message_count: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default=text("0")
    )
    period_started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="usage_counter")


__all__ = [
    "Base",
    "EMBEDDING_DIM",
    "User",
    "Document",
    "Chunk",
    "ChatSession",
    "SessionDocument",
    "Message",
    "MessageCitation",
    "UsageCounter",
]
