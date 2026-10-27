"""Auth endpoints: account creation, sign-in/out and account deletion.

Stub handlers only -- password verification, establishing the session and
cascading account deletion are the development sprint's work (US-001,
US-002, US-003). Wiring the routes now keeps the OpenAPI document (and
anything generated from it) in sync with the approved API spec from day one.
"""

from fastapi import APIRouter, Depends

from app.schemas import StubResponse
from app.security import require_api_secret

router = APIRouter(tags=["auth"])


@router.post("/auth/signup", response_model=StubResponse)
async def signup() -> StubResponse:
    """Create account with unique email and strong password, then establish a session."""
    return StubResponse(endpoint="POST /auth/signup")


@router.post("/auth/signin", response_model=StubResponse)
async def signin() -> StubResponse:
    """Authenticate email+password and establish a session; generic failure on mismatch."""
    return StubResponse(endpoint="POST /auth/signin")


@router.post(
    "/auth/signout", response_model=StubResponse, dependencies=[Depends(require_api_secret)]
)
async def signout() -> StubResponse:
    """End the current session."""
    return StubResponse(endpoint="POST /auth/signout")


@router.delete("/account", response_model=StubResponse, dependencies=[Depends(require_api_secret)])
async def delete_account() -> StubResponse:
    """Permanently delete account and all documents, embeddings, sessions and messages."""
    return StubResponse(endpoint="DELETE /account")
