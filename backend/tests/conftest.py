"""Shared pytest fixtures.

`apply_migrations` runs the real Alembic migrations against the real
Postgres this project's sandbox provides (same `DATABASE_URL` the app
itself reads; see ENVIRONMENT.md) -- not against a mock, so a test proves
the migration actually builds the schema it claims to.
"""

from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config

BACKEND_DIR = Path(__file__).resolve().parent.parent


@pytest.fixture(scope="session")
def apply_migrations() -> None:
    """Upgrade the sandbox database to `head`. Safe to call more than once:
    Alembic tracks the applied revision and no-ops when already there."""
    config = Config(str(BACKEND_DIR / "alembic.ini"))
    config.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    command.upgrade(config, "head")
