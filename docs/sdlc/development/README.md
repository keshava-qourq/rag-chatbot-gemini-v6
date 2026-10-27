# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### PLAN-V1 · approved · source: plan:v1

Development plan version 1 is approved, organizing all backlog work into 5 sprints of capacity 20 points each.

Plan status: approved, version 1. Contains 5 sprints (Sprint 1-5) and 8 epics covering 20 stories and 11 tasks. Roles referenced: backend-agent, frontend-agent, integration-agent, security-agent, qa-agent.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008

- ⚠ No record of actual sprint execution, burndown, or completion status against this plan.
- ⚠ No dates given for plan approval or sprint start/end.

### SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 goal: stand up authentication and document upload foundations, capacity 20 points.

Goal: 'Stand up authentication and document upload foundations.' Capacity: 20. Likely covers EPIC-001 (User Accounts & Authentication: US-001, US-002) and the upload portion of EPIC-002 (US-004) based on goal wording; US-003 (delete account) is part of EPIC-001 but its wording more closely matches Sprint 4's 'full account deletion' goal.

**Related:** EPIC-001, US-001, US-002, US-003, US-004

- ⚠ Plan input does not explicitly assign backlog item IDs to this sprint; mapping above is inferred from goal text, not stated.
- ⚠ No completion/progress status for this sprint reported.

### SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 goal: deliver asynchronous document ingestion into pgvector plus document status, rename and delete, capacity 20 points.

Goal: 'Deliver asynchronous document ingestion into pgvector plus document status, rename and delete.' Capacity: 20. Wording aligns with US-005 (ingestion, with tasks T1-T4), US-006 (processing status), and EPIC-003 Document Management items US-007 (view), US-008 (rename), US-009 (delete).

**Related:** US-005, US-005-T1, US-005-T2, US-005-T3, US-005-T4, US-006, US-007, US-008, US-009

- ⚠ Sprint-to-item mapping inferred from goal text only; plan input gives no explicit assignment.
- ⚠ No progress/completion status reported for this sprint.

### SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 goal: enable chat sessions and grounded question answering with citations and not-found handling, capacity 20 points.

Goal: 'Enable chat sessions and grounded question answering with citations and not-found handling.' Capacity: 20. Wording aligns with EPIC-004 Chat Sessions (US-010 to US-013) and EPIC-005 Grounded QA items US-014 (with tasks T1-T4), US-015 (citations), US-016 (not-found reply).

**Related:** US-010, US-011, US-012, US-013, US-014, US-014-T1, US-014-T2, US-014-T3, US-014-T4, US-015, US-016

- ⚠ Sprint-to-item mapping inferred from goal text only; not explicitly stated in the plan input.
- ⚠ No progress/completion status reported for this sprint.

### SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 goal: harden per-user data isolation, enforce usage limits, and support full account deletion, capacity 20 points.

Goal: 'Harden per-user data isolation, enforce usage limits, and support full account deletion.' Capacity: 20. Wording aligns with EPIC-006 (US-018 and tasks T1-T3), EPIC-007 (US-019), and US-003 (delete account and data) from EPIC-001.

**Related:** US-018, US-018-T1, US-018-T2, US-018-T3, US-019, US-003

- ⚠ Sprint-to-item mapping inferred from goal text only; not explicitly assigned in the plan input.
- ⚠ Possible discrepancy: US-003 is listed under EPIC-001 (Sprint 1 theme) but its goal text ('full account deletion') matches Sprint 4 instead -- flagging for confirmation of actual sprint placement.
- ⚠ No progress/completion status reported for this sprint.

### SPRINT-5 · approved · source: plan:Sprint 5

Sprint 5 goal: add conversational context and the responsive dashboard, capacity 20 points.

Goal: 'Add conversational context and the responsive dashboard.' Capacity: 20. Wording aligns with US-017 (use earlier messages as context, from EPIC-005) and EPIC-008 Responsive Dashboard (US-020).

**Related:** US-017, US-020

- ⚠ Sprint-to-item mapping inferred from goal text only; not explicitly assigned in the plan input.
- ⚠ No progress/completion status reported for this sprint; this is the final planned sprint and no outcome data is available.

### EPIC-001 · approved · source: plan:EPIC-001

User Accounts & Authentication epic covers sign-up, sign-in/out, and account deletion.

Backlog items: US-001 Sign up for an account (5 pts, backend-agent); US-002 Sign in and sign out (3 pts, backend-agent); US-003 Delete my account and data (5 pts, backend-agent). All assigned to backend-agent role per plan v1.

**Related:** US-001, US-002, US-003

- ⚠ No implementation status, code, or test evidence provided for any item in this epic.

### EPIC-002 · approved · source: plan:EPIC-002

Document Upload & Ingestion epic covers uploading files and processing them into the vector store, including status visibility.

Backlog items: US-004 Upload a document (5 pts, backend-agent); US-005 Process documents into the vector store (8 pts, integration-agent) broken into US-005-T1 multi-format text extraction, US-005-T2 chunking, US-005-T3 integrate gemini-embedding-001 and persist vectors (all integration-agent), and US-005-T4 handle ingestion failures (backend-agent); US-006 See per-document processing status (2 pts, frontend-agent).

**Related:** US-004, US-005, US-005-T1, US-005-T2, US-005-T3, US-005-T4, US-006

- ⚠ No implementation status, code, or test evidence provided for any item in this epic.
- ⚠ No detail given on which vector store schema or failure-handling behavior was actually implemented for US-005-T4.

### EPIC-003 · approved · source: plan:EPIC-003

Document Management epic covers viewing, renaming, and deleting uploaded documents.

Backlog items: US-007 View my documents (3 pts, frontend-agent); US-008 Rename a document (2 pts, frontend-agent); US-009 Delete a document and its embeddings (3 pts, backend-agent).

**Related:** US-007, US-008, US-009

- ⚠ No implementation status, code, or test evidence provided for any item in this epic.

### EPIC-004 · approved · source: plan:EPIC-004

Chat Sessions epic covers creating document-scoped chat sessions and managing their history.

Backlog items: US-010 Create a chat session scoped to selected documents (5 pts, backend-agent); US-011 View my chat sessions and their history (3 pts, frontend-agent); US-012 Rename a chat session (1 pt, frontend-agent); US-013 Delete a chat session (2 pts, backend-agent).

**Related:** US-010, US-011, US-012, US-013

- ⚠ No implementation status, code, or test evidence provided for any item in this epic.

### EPIC-005 · approved · source: plan:EPIC-005

Grounded Question Answering epic covers retrieval-augmented answers with citations, not-found handling, and conversational context.

Backlog items: US-014 Ask a question and get a grounded answer (8 pts, integration-agent) broken into US-014-T1 scoped chunk retrieval (backend-agent), US-014-T2 grounded prompt construction (integration-agent), US-014-T3 streaming gemini-2.5-flash call (integration-agent), US-014-T4 persist messages and citation records (backend-agent); US-015 See source citations on answers (3 pts, backend-agent); US-016 Graceful 'not found' reply (2 pts, backend-agent); US-017 Use earlier messages as conversational context (3 pts, backend-agent).

**Related:** US-014, US-014-T1, US-014-T2, US-014-T3, US-014-T4, US-015, US-016, US-017

- ⚠ No implementation status, code, or test evidence provided for any item in this epic.
- ⚠ No detail on prompt design, citation format, or streaming behavior beyond the task titles.

### EPIC-006 · approved · source: plan:EPIC-006

Per-User Data Isolation & Privacy epic covers ensuring users can only access their own data, with dedicated testing and audit tasks.

Backlog items: US-018 Access only my own data (8 pts, security-agent) broken into US-018-T1 add ownership checks to document and session endpoints (security-agent), US-018-T2 add cross-user isolation test suite (qa-agent), US-018-T3 audit and close any remaining authorization gaps (security-agent).

**Related:** US-018, US-018-T1, US-018-T2, US-018-T3

- ⚠ No implementation status, code, or test evidence provided for any item in this epic.
- ⚠ No results of the planned cross-user isolation test suite (US-018-T2) or authorization audit (US-018-T3) have been reported.

### EPIC-007 · approved · source: plan:EPIC-007

Usage Limits epic covers enforcing per-user usage limits for the free launch tier.

Backlog item: US-019 Enforce per-user usage limits (5 pts, backend-agent).

**Related:** US-019

- ⚠ No implementation status, code, or test evidence provided.
- ⚠ Specific limit thresholds (e.g. requests/day, storage caps) are not defined in this input.

### EPIC-008 · approved · source: plan:EPIC-008

Responsive Dashboard epic covers a unified, responsive view of a user's documents and chat sessions.

Backlog item: US-020 View a responsive dashboard of my documents and sessions (5 pts, frontend-agent).

**Related:** US-020

- ⚠ No implementation status, code, or test evidence provided.
- ⚠ No detail on specific dashboard layout, widgets, or responsive breakpoints.
<!-- sdlc:auto:end narrative -->
