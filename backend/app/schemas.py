"""Pydantic request and response models.

One pair per entity in the approved data model, plus the placeholder every
generated route returns until it has been implemented.
"""

import re

from pydantic import BaseModel, field_validator

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class StubResponse(BaseModel):
    """What a generated route returns until someone implements it.

    A stub that returns a typed body rather than raising keeps the service
    startable and its OpenAPI document complete, so the frontend can be built
    against the agreed shape while the handlers are still being written.
    """

    endpoint: str
    status: str = "not_implemented"
    detail: str = "Scaffolded from the approved API spec; no behaviour yet."


class SignupRequest(BaseModel):
    """POST /auth/signup body. Validated here so a bad value never reaches
    a handler (NFR-001: minimum password strength, rejected at sign-up)."""

    email: str
    password: str

    @field_validator("email")
    @classmethod
    def _valid_email(cls, value: str) -> str:
        value = value.strip()
        if not _EMAIL_RE.match(value):
            raise ValueError("enter a valid email address, e.g. name@example.com")
        return value

    @field_validator("password")
    @classmethod
    def _strong_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("password must be at least 8 characters long")
        if not re.search(r"[A-Za-z]", value) or not re.search(r"\d", value):
            raise ValueError("password must contain both letters and numbers")
        return value


class SigninRequest(BaseModel):
    """POST /auth/signin body. Deliberately unvalidated beyond "present":
    rejecting a malformed email here would leak which emails are registered."""

    email: str
    password: str


class UserResponse(BaseModel):
    """What signup/signin return: the authenticated user, never the password hash."""

    user_id: str
    email: str


class OkResponse(BaseModel):
    ok: bool = True
