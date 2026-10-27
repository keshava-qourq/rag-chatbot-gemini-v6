<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-10-27

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v2.

## Considered Options

- PostgreSQL 16
- MySQL plus a separate vector DB
- MongoDB plus Pinecone

## Decision Outcome

Chosen option: PostgreSQL 16, because Holds users, documents, chunks, sessions and messages relationally and the embeddings via pgvector in one system, so per-user isolation and cascade deletion of a document's embeddings happen in one place (NFR-004, NFR-005).

## Consequences

pgvector at low scale is ample for tens to low-hundreds of users; a dedicated vector DB would add an unneeded second system.
<!-- sdlc:auto:end adr -->