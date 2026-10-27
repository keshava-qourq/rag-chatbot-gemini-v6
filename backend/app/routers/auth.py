"""Auth endpoints: account creation, sign-in/out and account deletion.

Account deletion (US-003) is still a stub; signup/signin/signout (US-001,
US-002) establish and tear down the session cookie every later per-user
router authenticates with (`app.security.current_user`).
"""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import OkResponse, SigninRequest, SignupRequest, StubResponse, UserResponse
from app.security import (
    _DUMMY_PASSWORD_HASH,
    hash_password,
    require_api_secret,
    verify_password,
)

router = APIRouter(tags=["auth"])


@router.post("/auth/signup", response_model=UserResponse)
async def signup(
    payload: SignupRequest,
    request: Request,
    db: Session = Depends(get_db),  # noqa: B008 -- FastAPI's own dependency-injection idiom
) -> UserResponse:
    """Create account with unique email and strong password, then establish a session."""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="email is already registered"
        )

    user = User(email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="email is already registered"
        ) from None
    db.refresh(user)

    request.session["user_id"] = str(user.id)
    return UserResponse(user_id=str(user.id), email=str(user.email))


@router.post("/auth/signin", response_model=UserResponse)
async def signin(
    payload: SigninRequest,
    request: Request,
    db: Session = Depends(get_db),  # noqa: B008 -- FastAPI's own dependency-injection idiom
) -> UserResponse:
    """Authenticate email+password and establish a session; generic failure on mismatch."""
    user = db.query(User).filter(User.email == payload.email).first()
    # Verify against a real hash either way, so a non-existent email takes the
    # same time as a wrong password (NFR-003: never reveal whether it is registered).
    password_hash = user.password_hash if user is not None else _DUMMY_PASSWORD_HASH
    password_ok = verify_password(payload.password, password_hash)

    if user is None or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid email or password"
        )

    request.session["user_id"] = str(user.id)
    return UserResponse(user_id=str(user.id), email=str(user.email))


@router.post("/auth/signout", response_model=OkResponse)
async def signout(request: Request) -> OkResponse:
    """End the current session.

    Not gated by `require_api_secret`/`current_user`: signing out of a
    session that is already missing, stale or invalid must still succeed
    (and the old cookie must not work afterwards, AC-006) rather than 401
    before it ever gets the chance to clear anything.
    """
    request.session.clear()
    return OkResponse()


@router.delete("/account", response_model=StubResponse, dependencies=[Depends(require_api_secret)])
async def delete_account() -> StubResponse:
    """Permanently delete account and all documents, embeddings, sessions and messages."""
    return StubResponse(endpoint="DELETE /account")
