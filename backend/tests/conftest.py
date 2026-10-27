"""Shared pytest fixtures.

`apply_migrations` runs the real Alembic migrations against the real
Postgres this project's sandbox provides (same `DATABASE_URL` the app
itself reads; see ENVIRONMENT.md) -- not against a mock, so a test proves
the migration actually builds the schema it claims to.
"""

from collections.abc import Iterator
from pathlib import Path

import pytest
from alembic.config import Config
from sqlalchemy.orm import Session

from alembic import command
from app.database import SessionLocal

BACKEND_DIR = Path(__file__).resolve().parent.parent


@pytest.fixture(scope="session")
def apply_migrations() -> None:
    """Upgrade the sandbox database to `head`. Safe to call more than once:
    Alembic tracks the applied revision and no-ops when already there."""
    config = Config(str(BACKEND_DIR / "alembic.ini"))
    config.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    command.upgrade(config, "head")


@pytest.fixture
def db_session() -> Iterator[Session]:
    """A plain session against the real database, for tests that assert on
    rows a handler wrote -- not a mock, the same engine the app itself uses."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
