"""Engine, session factory and the request-scoped session dependency.

Defaults to the Postgres `docker-compose.yml` brings up (same URL as
`.env.example`), not SQLite: this architecture's schema needs pgvector,
which exists only in Postgres, so there is no simpler engine that could
actually run it. Point `DATABASE_URL` at the real deployment database when
it exists; nothing else has to change. The schema itself lives in Alembic
migrations (see `backend/alembic/`), not here.
"""

import os
from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://app:app@db:5432/app")

# Recycles a connection the database (or an intervening proxy) has quietly
# closed, instead of handing the next request a dead one.
engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Declarative base that every generated model inherits."""


def get_db() -> Iterator[Session]:
    """One session per request, closed even when the handler raises."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
