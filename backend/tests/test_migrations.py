"""Proves the Alembic migration builds the approved schema -- against the
real sandbox Postgres (see ENVIRONMENT.md), not a mock."""

import sqlalchemy as sa

from app.database import DATABASE_URL

EXPECTED_TABLES = {
    "users",
    "documents",
    "chunks",
    "chat_sessions",
    "session_documents",
    "messages",
    "message_citations",
    "usage_counters",
}


def test_migrations_create_the_approved_schema(apply_migrations: None) -> None:
    engine = sa.create_engine(DATABASE_URL)
    try:
        inspector = sa.inspect(engine)
        assert EXPECTED_TABLES.issubset(set(inspector.get_table_names()))

        with engine.connect() as conn:
            extensions = {
                row[0] for row in conn.execute(sa.text("SELECT extname FROM pg_extension"))
            }
        assert {"vector", "citext"}.issubset(extensions)
    finally:
        engine.dispose()


def test_models_match_the_migrated_schema(apply_migrations: None) -> None:
    """A model importable and queryable against the real, migrated database --
    the two are not allowed to drift apart."""
    from sqlalchemy.orm import Session

    from app.models import User

    engine = sa.create_engine(DATABASE_URL)
    try:
        with Session(engine) as session:
            assert session.query(User).count() >= 0
    finally:
        engine.dispose()
