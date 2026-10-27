# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Sign up for an account | US-001 | 1 | POST /auth/signup, api, db, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-002 | EPIC-001 | Sign in and sign out | US-002 | 1 | POST /auth/signin, POST /auth/signout, api, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-003 | EPIC-001 | Delete my account and data | US-003 | 4 | DELETE /account, api, chat_sessions, chunks, db, documents, messages, users | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-004 | EPIC-002 | Upload a document | US-004 | 1 | POST /documents, api, documents, queue, storage | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-005 | EPIC-002 | Process documents into the vector store | US-005, US-005-T1, US-005-T2, US-005-T3, US-005-T4 | 2 | chunks, db, documents, gemini, queue, worker | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-006 | EPIC-002 | See per-document processing status | US-006 | 2 | GET /documents, api, documents, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-007 | EPIC-003 | View my documents | US-007 | 1 | GET /documents, api, documents, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-008 | EPIC-003 | Rename a document | US-008 | 1 | PATCH /documents/{id}, api, documents, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-009 | EPIC-003 | Delete a document and its embeddings | US-009 | 2 | DELETE /documents/{id}, api, chunks, db, documents | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-010 | EPIC-004 | Create a chat session scoped to selected documents | US-010 | 2 | POST /sessions, api, chat_sessions, db, documents, session_documents | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-011 | EPIC-004 | View my chat sessions and their history | US-011 | 3 | GET /sessions, GET /sessions/{id}/messages, api, chat_sessions, messages, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-012 | EPIC-004 | Rename a chat session | US-012 | 3 | PATCH /sessions/{id}, api, chat_sessions, web | — | — | not started | not run | 0/1 tested · 0/1 passing | — |
| US-013 | EPIC-004 | Delete a chat session | US-013 | 3 | DELETE /sessions/{id}, api, chat_sessions, db, messages | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-014 | EPIC-005 | Ask a question and get a grounded answer | US-014, US-014-T1, US-014-T2, US-014-T3, US-014-T4 | 3 | POST /sessions/{id}/messages, api, chat_sessions, chunks, db, gemini, messages, session_documents | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-015 | EPIC-005 | See source citations on answers | US-015 | 3 | POST /sessions/{id}/messages, api, message_citations, messages | — | — | not started | not run | 0/1 tested · 0/1 passing | — |
| US-016 | EPIC-005 | Graceful 'not found' reply | US-016 | 3 | POST /sessions/{id}/messages, api, gemini, messages | — | — | not started | not run | 0/1 tested · 0/1 passing | — |
| US-017 | EPIC-005 | Use earlier messages as conversational context | US-017 | 5 | POST /sessions/{id}/messages, api, messages | — | — | not started | not run | 0/1 tested · 0/1 passing | — |
| US-018 | EPIC-006 | Access only my own data | US-018, US-018-T1, US-018-T2, US-018-T3 | 4 | DELETE /documents/{id}, DELETE /sessions/{id}, GET /documents, GET /documents/{id}, GET /sessions, GET /sessions/{id}/messages, PATCH /documents/{id}, PATCH /sessions/{id}, POST /sessions/{id}/messages, api, chat_sessions, documents, messages, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-019 | EPIC-007 | Enforce per-user usage limits | US-019 | 4 | POST /documents, POST /sessions/{id}/messages, api, db, usage_counters | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-020 | EPIC-008 | View a responsive dashboard of my documents and sessions | US-020 | 5 | GET /documents, GET /sessions, api, chat_sessions, documents, web | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
<!-- sdlc:auto:end matrix -->
