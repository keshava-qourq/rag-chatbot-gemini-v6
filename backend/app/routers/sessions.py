"""Chat session endpoints: create/list/rename/delete sessions, read and send messages.

Stub handlers only -- retrieval, the message-limit check and the streaming
gemini-2.5-flash answer are the development sprint's work (US-014, US-016,
US-017). `post_message`'s real handler returns `text/event-stream`; the stub
keeps the ordinary JSON stub shape so it starts and documents like every
other generated route, and the development sprint replaces the return type
along with the body.
"""

from fastapi import APIRouter, Depends

from app.schemas import StubResponse
from app.security import require_api_secret

router = APIRouter(tags=["sessions"], dependencies=[Depends(require_api_secret)])


@router.post("/sessions", response_model=StubResponse)
async def create_session() -> StubResponse:
    """Create a chat session scoped to one or more of the user's ready documents."""
    return StubResponse(endpoint="POST /sessions")


@router.get("/sessions", response_model=StubResponse)
async def list_sessions() -> StubResponse:
    """List the user's chat sessions."""
    return StubResponse(endpoint="GET /sessions")


@router.patch("/sessions/{session_id}", response_model=StubResponse)
async def rename_session(session_id: str) -> StubResponse:
    """Rename a chat session to a non-empty name."""
    return StubResponse(endpoint="PATCH /sessions/{id}")


@router.delete("/sessions/{session_id}", response_model=StubResponse)
async def delete_session(session_id: str) -> StubResponse:
    """Delete a session and its messages; selected documents remain."""
    return StubResponse(endpoint="DELETE /sessions/{id}")


@router.get("/sessions/{session_id}/messages", response_model=StubResponse)
async def list_messages(session_id: str) -> StubResponse:
    """Get the ordered message history of a session owned by the user."""
    return StubResponse(endpoint="GET /sessions/{id}/messages")


@router.post("/sessions/{session_id}/messages", response_model=StubResponse)
async def post_message(session_id: str) -> StubResponse:
    """Ask a question; streams a grounded gemini-2.5-flash answer with citations."""
    return StubResponse(endpoint="POST /sessions/{id}/messages")
