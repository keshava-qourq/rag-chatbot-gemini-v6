"""Generated routers: one per architecture component that owns endpoints."""

from app.routers.auth import router as auth_router
from app.routers.documents import router as documents_router
from app.routers.sessions import router as sessions_router

__all__ = ["auth_router", "documents_router", "sessions_router"]
