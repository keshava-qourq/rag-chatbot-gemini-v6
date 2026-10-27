"""Application entrypoint.

Generated from the approved architecture: one router per component that owns
endpoints, one route per endpoint the API spec declares. Every generated route
is a stub that returns a typed placeholder, so the service starts, serves its
OpenAPI document and passes its tests before a single handler is implemented.
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.routers import auth_router, documents_router, sessions_router
from app.security import JWT_SECRET_KEY
from app.services import configured_services

_DESCRIPTION = (
    "Build a rag chatbot where user can upload there own documents and ask "
    "queries about them use gemini-2.5-flash for answers and "
    "gemini-embedding-001 for embeddings and have chat history and sessions"
)

app = FastAPI(
    title="Rag_chatbot_gemini_v6",
    description=_DESCRIPTION,
    version="0.1.0",
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. In development that is the Vite dev server; when
# deployed, the platform injects the frontend's real URL as ALLOWED_ORIGINS (comma
# separated). Point ALLOWED_ORIGINS at the real thing and nothing else has to change.
_dev_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
_allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins or _dev_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session-based auth (architecture: "Session-based auth, per-user authorization and
# isolation"): signs the session cookie with JWT_SECRET_KEY, never with SECRET_KEY --
# that one is public, see app/security.py. The development sprint reads/writes
# `request.session` in the auth router to establish and end a session.
app.add_middleware(
    SessionMiddleware,
    secret_key=JWT_SECRET_KEY,
    same_site="lax",
    https_only=False,  # the platform terminates TLS in front of this container
)

app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(sessions_router)

# The schema lives in Alembic migrations (see backend/alembic/), applied with
# `alembic upgrade head` before this container starts (see backend/Dockerfile)
# -- not created from the models here, so "change the schema only through
# migrations" stays true from the very first deploy.


@app.get("/health")
async def health() -> dict[str, object]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok", "services": configured_services()}
