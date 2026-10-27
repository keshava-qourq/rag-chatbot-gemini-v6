# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Stand up authentication and document upload foundations

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign up for an account | 5 | backend-agent | — |
| US-002 | Story | Sign in and sign out | 3 | backend-agent | US-001 |
| US-004 | Story | Upload a document | 5 | backend-agent | US-001 |
| US-007 | Story | View my documents | 3 | frontend-agent | US-004 |
| US-008 | Story | Rename a document | 2 | frontend-agent | US-007 |

## Sprint 2: Sprint 2

Deliver asynchronous document ingestion into pgvector plus document status, rename and delete

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-005 | Story | Process documents into the vector store | 8 | integration-agent | US-004 |
| ↳ US-005-T1 | Task | Implement multi-format text extraction | — | integration-agent | — |
| ↳ US-005-T2 | Task | Implement chunking | — | integration-agent | — |
| ↳ US-005-T3 | Task | Integrate gemini-embedding-001 and persist vectors | — | integration-agent | — |
| ↳ US-005-T4 | Task | Handle ingestion failures | — | backend-agent | — |
| US-006 | Story | See per-document processing status | 2 | frontend-agent | US-005 |
| US-009 | Story | Delete a document and its embeddings | 3 | backend-agent | US-007, US-005 |
| US-010 | Story | Create a chat session scoped to selected documents | 5 | backend-agent | US-006, US-007 |

## Sprint 3: Sprint 3

Enable chat sessions and grounded question answering with citations and not-found handling

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-011 | Story | View my chat sessions and their history | 3 | frontend-agent | US-010 |
| US-012 | Story | Rename a chat session | 1 | frontend-agent | US-011 |
| US-013 | Story | Delete a chat session | 2 | backend-agent | US-011 |
| US-014 | Story | Ask a question and get a grounded answer | 8 | integration-agent | US-010, US-005 |
| ↳ US-014-T1 | Task | Implement scoped chunk retrieval | — | backend-agent | — |
| ↳ US-014-T2 | Task | Build grounded prompt construction | — | integration-agent | — |
| ↳ US-014-T3 | Task | Integrate streaming gemini-2.5-flash call | — | integration-agent | — |
| ↳ US-014-T4 | Task | Persist messages and citation records | — | backend-agent | — |
| US-015 | Story | See source citations on answers | 3 | backend-agent | US-014 |
| US-016 | Story | Graceful 'not found' reply | 2 | backend-agent | US-014 |

## Sprint 4: Sprint 4

Harden per-user data isolation, enforce usage limits, and support full account deletion

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-003 | Story | Delete my account and data | 5 | backend-agent | US-001, US-009, US-013 |
| US-018 | Story | Access only my own data | 8 | security-agent | US-004, US-007, US-009, US-010, US-011, US-013, US-014 |
| ↳ US-018-T1 | Task | Add ownership checks to document and session endpoints | — | security-agent | — |
| ↳ US-018-T2 | Task | Add cross-user isolation test suite | — | qa-agent | — |
| ↳ US-018-T3 | Task | Audit and close any remaining authorization gaps | — | security-agent | — |
| US-019 | Story | Enforce per-user usage limits | 5 | backend-agent | US-004, US-014 |

## Sprint 5: Sprint 5

Add conversational context and the responsive dashboard

Capacity: 20 points · Committed: 8

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-017 | Story | Use earlier messages as conversational context | 3 | backend-agent | US-014 |
| US-020 | Story | View a responsive dashboard of my documents and sessions | 5 | frontend-agent | US-007, US-011 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
