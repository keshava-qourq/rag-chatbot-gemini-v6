<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-10-27

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v2.

## Considered Options

- FastAPI 0.115
- Django REST Framework
- Flask

## Decision Outcome

Chosen option: FastAPI 0.115, because Async-friendly for streaming answers (NFR-007) and for enqueueing background ingestion, and sits in the Python ecosystem where Google's SDK, document parsers and RAG tooling are strongest.

## Consequences

Not batteries-included (auth, admin assembled manually), accepted for a lightweight MVP; shares its code with the arq worker.
<!-- sdlc:auto:end adr -->