"""Shared request-level security primitives.

Two different secrets, two different jobs -- conflating them is the mistake
this module exists to prevent:

* ``SECRET_KEY`` is the bearer token the generated frontend sends on every
  call (`docs/sdlc/architecture/api/openapi.yaml`'s ``bearerAuth``, and
  `frontend/src/lib/api.ts`). It is public -- the platform bakes it into the
  frontend bundle -- so it must never sign anything.
* ``JWT_SECRET_KEY`` is private. It signs the session cookie Starlette's
  ``SessionMiddleware`` (wired in `app.main`) sets once a user signs in, and
  should sign any other token this API issues.

Both are read with a local, non-production default so the service starts for
a fresh clone; the platform always overrides them in a real deployment.
"""

import hmac
import os
import uuid

from fastapi import Depends, Header, HTTPException, Request, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

SECRET_KEY: str = os.getenv("SECRET_KEY", "")
JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-insecure-jwt-secret-change-me")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# A real bcrypt hash of a password nobody can sign in with, used to make
# signin take the same amount of time whether or not the email is
# registered (NFR-003: never reveal whether an email is registered).
_DUMMY_PASSWORD_HASH = pwd_context.hash("not-a-real-account-password")


def _unauthorized() -> HTTPException:
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="not authenticated")


def hash_password(password: str) -> str:
    """One-way hash a plaintext password for storage in ``users.password_hash``."""
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Whether ``password`` matches a hash produced by :func:`hash_password`."""
    return pwd_context.verify(password, password_hash)


async def require_api_secret(authorization: str | None = Header(default=None)) -> None:
    """Reject a call that does not carry the platform's shared bearer.

    Every endpoint the API spec marks ``auth: Session`` depends on this (the
    per-user session check itself is layered on top, by the development
    sprint). When ``SECRET_KEY`` is not configured -- a bare local clone --
    the check is skipped so the service is usable without it; every real
    deployment sets it.
    """
    if not SECRET_KEY:
        return
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="missing bearer token")
    token = authorization.removeprefix("Bearer ").strip()
    if not hmac.compare_digest(token, SECRET_KEY):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid bearer token")


async def current_user(
    request: Request,
    db: Session = Depends(get_db),  # noqa: B008 -- FastAPI's own dependency-injection idiom
) -> User:
    """The signed-in user, from the session cookie `app.routers.auth` sets.

    Fails closed: any missing, malformed or stale session -- no cookie, a
    cookie whose ``user_id`` is not a UUID, or a UUID with no matching row
    (e.g. a deleted account) -- is a 401, never a 500 and never a user. This
    is the dependency every later, per-user router (documents, sessions)
    reuses in place of `require_api_secret` alone.
    """
    user_id = request.session.get("user_id")
    if not user_id:
        raise _unauthorized()
    try:
        uid = uuid.UUID(str(user_id))
    except ValueError as exc:
        request.session.clear()
        raise _unauthorized() from exc
    user = db.get(User, uid)
    if user is None:
        request.session.clear()
        raise _unauthorized()
    return user
