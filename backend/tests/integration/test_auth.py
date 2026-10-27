"""Integration tests for POST /auth/signup, /auth/signin, /auth/signout.

Runs against the real sandbox Postgres (via `apply_migrations`), not a mock.
Each test uses its own unique email so tests never collide with each other.
"""

import uuid

from fastapi import Depends
from fastapi.testclient import TestClient

from app.main import app
from app.models import User
from app.security import current_user

VALID_PASSWORD = "correctHorse123"


def _email() -> str:
    return f"user-{uuid.uuid4().hex}@example.com"


# `current_user` is the reusable dependency the packet requires -- mounted
# once here onto the real app (same SessionMiddleware, same secret) so these
# tests can prove the real session cookie it reads is set and cleared
# correctly, without the development sprint's later routers existing yet.
if "/__whoami__" not in {route.path for route in app.routes}:

    @app.get("/__whoami__")
    def _whoami(
        user: User = Depends(current_user),  # noqa: B008 -- FastAPI's own DI idiom
    ) -> dict[str, str]:
        return {"email": str(user.email)}


def test_ac001_signup_creates_account_and_session(apply_migrations: None) -> None:
    client = TestClient(app)
    email = _email()

    response = client.post("/auth/signup", json={"email": email, "password": VALID_PASSWORD})

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == email
    assert "user_id" in body and body["user_id"]
    # A signed session cookie was set: current_user accepts it right after.
    whoami = client.get("/__whoami__")
    assert whoami.status_code == 200
    assert whoami.json()["email"] == email


def test_ac001_password_is_never_stored_as_plaintext(apply_migrations: None, db_session) -> None:
    client = TestClient(app)
    email = _email()

    client.post("/auth/signup", json={"email": email, "password": VALID_PASSWORD})

    user = db_session.query(User).filter(User.email == email).one()
    assert user.password_hash != VALID_PASSWORD
    assert user.password_hash.startswith("$2b$")


def test_ac002_duplicate_email_returns_409_and_creates_no_account(
    apply_migrations: None, db_session
) -> None:
    client = TestClient(app)
    email = _email()

    first = client.post("/auth/signup", json={"email": email, "password": VALID_PASSWORD})
    assert first.status_code == 200

    second = client.post("/auth/signup", json={"email": email, "password": "anotherStrong1"})

    assert second.status_code == 409
    assert "already registered" in second.json()["detail"]
    assert db_session.query(User).filter(User.email == email).count() == 1


def test_ac003_invalid_email_format_returns_422_with_field_message(
    apply_migrations: None,
) -> None:
    client = TestClient(app)

    response = client.post(
        "/auth/signup", json={"email": "not-an-email", "password": VALID_PASSWORD}
    )

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(item["loc"][-1] == "email" for item in detail)


def test_ac003_weak_password_returns_422_with_field_message(apply_migrations: None) -> None:
    client = TestClient(app)

    response = client.post("/auth/signup", json={"email": _email(), "password": "short1"})

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(item["loc"][-1] == "password" for item in detail)


def test_ac004_signin_with_correct_credentials_sets_valid_session(
    apply_migrations: None,
) -> None:
    client = TestClient(app)
    email = _email()
    client.post("/auth/signup", json={"email": email, "password": VALID_PASSWORD})
    client.cookies.clear()

    response = client.post("/auth/signin", json={"email": email, "password": VALID_PASSWORD})

    assert response.status_code == 200
    assert response.json()["email"] == email
    whoami = client.get("/__whoami__")
    assert whoami.status_code == 200
    assert whoami.json()["email"] == email


def test_ac005_signin_with_wrong_password_returns_401_generic_message(
    apply_migrations: None,
) -> None:
    client = TestClient(app)
    email = _email()
    client.post("/auth/signup", json={"email": email, "password": VALID_PASSWORD})
    client.cookies.clear()

    response = client.post("/auth/signin", json={"email": email, "password": "wrongPassword1"})

    assert response.status_code == 401
    assert response.json()["detail"] == "invalid email or password"


def test_ac005_signin_with_unregistered_email_returns_same_generic_message(
    apply_migrations: None,
) -> None:
    client = TestClient(app)

    response = client.post(
        "/auth/signin", json={"email": _email(), "password": "whateverPassword1"}
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "invalid email or password"


def test_ac006_signout_invalidates_the_old_session_cookie(apply_migrations: None) -> None:
    client = TestClient(app)
    email = _email()
    client.post("/auth/signup", json={"email": email, "password": VALID_PASSWORD})
    assert client.get("/__whoami__").status_code == 200

    signout = client.post("/auth/signout")
    assert signout.status_code == 200

    response = client.get("/__whoami__")
    assert response.status_code == 401
    assert "email" not in response.json()
