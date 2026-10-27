# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `5e719aa` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
Rag_chatbot_gemini_v6 is a generated scaffold for a RAG chatbot (document upload + Q&A with chat history/sessions, intended to use Gemini models). It is split into two independently run apps in one repo: a Vite + React 19 SPA (`frontend/`) with fully approved, reviewed screens that currently render seeded sample data, and a FastAPI backend (`backend/`) that only has a health-check endpoint and the plumbing (SQLAlchemy models/Base, Pydantic schemas, DB session) for future endpoints to be added. A docker-compose file provisions Postgres and Redis for when the real architecture is implemented, but the backend defaults to a local SQLite file so it runs with no external services.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for Vite 6 / React 19 / TypeScript 5.6 toolchain in frontend/package.json)
- Python 3.12 (matches backend/Dockerfile base image)
- pip
- Docker and Docker Compose (optional, for Postgres and Redis via docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository
2. Copy .env.example to .env and fill in required values
3. cd backend && pip install -r requirements.txt
4. cd frontend && npm install
5. (optional) from the repo root, run docker-compose up -d to start Postgres and Redis if DATABASE_URL/queue are pointed at them
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service locally with auto-reload; serves /health and the OpenAPI docs |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the React SPA |
| frontend build | `cd frontend && npm run build` | Bundles the app with vite build (does not typecheck) |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally for verification |
| infra up | `docker-compose up -d` | Starts Postgres 16 (port 5432) and Redis 7 (port 6379) containers defined in docker-compose.yml |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `backend/` | FastAPI service: app entrypoint, DB engine/session, models, Pydantic schemas, routers package, tests, Dockerfile |
| `backend/app/` | Application code: main.py (FastAPI app + CORS + health route), database.py (engine/session), models.py (SQLAlchemy Base, currently empty), schemas.py (StubResponse), services.py (configured services check), routers/ (empty, for future per-component routers) |
| `backend/tests/` | Pytest tests, currently covering the health endpoint |
| `frontend/` | Vite + React 19 SPA: approved UI screens running on seeded sample data |
| `frontend/src/` | App source: main.tsx entry, lib/ (api client, UI/icon vocabulary, navigation helpers), index.css (brand tokens) |
| `frontend/e2e/` | Playwright end-to-end specs, run against either a local build or a deployed URL via E2E_BASE_URL |
| `.quorq/` | Quorq AI SDLC platform metadata (handoff.json) for this generated project |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend routes are generated as typed stubs (StubResponse) returning status 'not_implemented' until a handler is written, keeping the service startable and its OpenAPI spec complete
- One router per architecture component is expected under backend/app/routers/, currently empty since no architecture was approved yet
- All SQLAlchemy models inherit the shared Base from app/database.py; tables are created on startup via Base.metadata.create_all (no migrations yet)
- Backend defaults to SQLite (DATABASE_URL env var overrides it, e.g. to Postgres)
- CORS origins are controlled via the ALLOWED_ORIGINS env var (comma-separated), falling back to the Vite dev server origin in development
- Frontend screens live under src/ and currently render seeded sample data; frontend/src/lib/api.ts is the designated seam for wiring real API calls (API_BASE_URL/API_SECRET_KEY from Vite env vars)
- Frontend uses the @/ path alias for src/, TypeScript strict mode (with noImplicitAny/strictNullChecks relaxed), ESLint + Prettier for style, Tailwind v4 via the Vite plugin
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs backend unit tests (currently the health check) with coverage configured via pytest-cov |
| backend lint | `cd backend && ruff check .` | Lints backend Python code |
| backend format | `cd backend && ruff format .` | Formats backend Python code |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests under src/ with jsdom |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint across the frontend app; this is the gate the platform runs during development |
| frontend e2e | `cd frontend && npm run test:e2e` | Runs Playwright specs from e2e/; builds/serves the app locally unless E2E_BASE_URL is set |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit; not run by build, but worth keeping clean |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Frontend calls to the backend are blocked by the browser (CORS error) | Set ALLOWED_ORIGINS in the backend environment to the frontend's origin (comma-separated for multiple), or rely on the localhost:5173 default during local dev |
| `npm run build` succeeds but the app has type errors | Run `npm run typecheck` (tsc --noEmit) separately, since build does not typecheck |
| `pytest` from backend/ fails with ImportError for `app` | Run pytest from the backend/ directory itself; pytest.ini sets pythonpath = . relative to that directory |
| Playwright e2e tests fail to start a browser | Run `npm run test:e2e:install` first to fetch the Chromium browser |
| Backend needs a real database or queue instead of SQLite | Run `docker-compose up -d` to start Postgres/Redis, then set DATABASE_URL (and relevant redis config) accordingly |
<!-- sdlc:auto:end troubleshooting -->
