# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-SCOPE-001 · approved · source: requirements:scope

Requirements v1 defines a lightweight-scope RAG chatbot: users sign up, upload their own documents, and ask grounded questions over them with citations, chat history, and sessions.

In scope: account sign-up/sign-in; document upload (PDF, Word, PowerPoint, text, markdown); async parsing/chunking/embedding into a vector store; chat session creation scoped to selected documents; grounded Q&A with citations; graceful 'not found' replies; conversational context; persistent multi-session chat history; per-user data isolation; document management (view/rename/delete, embeddings removed on delete); session management (view/rename/delete); account deletion with full data removal; responsive dashboard; free-to-use at launch with no billing.
Out of scope: OCR of scanned PDFs/images; querying of spreadsheet/tabular data (CSV/Excel); native mobile/desktop apps; email (SendGrid removed from stack).

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008

### REQ-TECHSTACK-001 · approved · source: requirements:tech-stack

Product owner approved an exact technology stack: FastAPI backend, AWS cloud, PostgreSQL 16 with pgvector, React 19 frontend. Design must use exactly these, no substitutions.

- Backend: FastAPI 0.115 -- chosen for Python's strength in document parsing, Google SDK integration, RAG tooling, streaming responses, and background ingestion.
- Cloud: AWS -- chosen for S3 (file storage up to ~25MB/file), managed PostgreSQL with pgvector, and compute for app + workers, with free tier suited to tens-to-low-hundreds of users.
- Database: PostgreSQL 16 -- single system for relational data (users, documents, chats) plus pgvector for semantic search, simplifying isolation, backup, and account/data deletion.
- Frontend: React 19 -- chosen for building a responsive, stateful, frequently-updating UI (streaming chat, per-document status, session management) with a large developer pool for fast MVP delivery.

### REQ-RUNTIME-001 · approved · source: requirements:runtime-needs

Approved runtime services and credentials: Google Gemini API for answers and embeddings, pgvector inside PostgreSQL, Amazon S3 for file storage, and a Redis-backed queue for asynchronous ingestion.

- AI provider: Google Gemini (SaaS), env GEMINI_API_KEY -- drives both gemini-2.5-flash answers and gemini-embedding-001 embeddings.
- Vector store: pgvector inside existing PostgreSQL -- no separate database needed; document deletion can remove embeddings in the same place the record lives.
- File storage: Amazon S3 (SaaS), env AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION / S3_BUCKET -- stores original PDF/Word/PowerPoint uploads up to ~25MB, out of the database, re-downloadable/re-processable.
- Queue: Redis (container redis:7-alpine), env REDIS_URL -- backs asynchronous ingestion (parse/chunk/embed) so uploads return immediately and workers process in the background with per-document status.
Full API key list required: AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, GEMINI_API_KEY, REDIS_URL, S3_BUCKET.

**Related:** EPIC-002, EPIC-005

### EPIC-001 · approved · source: requirements:EPIC-001

Public email/password sign-up and sign-in with session-based authentication, and account deletion that removes all user data. No SSO/social login at launch, and no email verification due to removal of email sending from scope.

- US-001 (critical) Sign up for an account: AC-001 valid unique email + strong password creates account, signs user in, redirects to dashboard; AC-002 duplicate email rejected with error; AC-003 invalid email format or weak password rejected with validation message.
- US-002 (critical) Sign in/out: AC-004 correct credentials authenticate and reach dashboard; AC-005 mismatched credentials show a generic invalid-credentials message (does not reveal which field was wrong, per NFR-003); AC-006 sign-out ends session, blocking further access to authenticated pages.
- US-003 (high) Delete account and data: AC-007 confirmed deletion removes account, documents, embeddings, sessions and messages, then signs user out; AC-008 deleted credentials can no longer authenticate.
- NFR-001: minimum password strength enforced at sign-up. NFR-002: session-based auth required on every endpoint returning user data. NFR-011 (accepted risk): no email verification at launch because SendGrid/email sending was removed from scope; accounts are usable immediately after sign-up.

**Related:** US-001, US-002, US-003, AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, NFR-001, NFR-002, NFR-003, NFR-011

- ⚠ Conflict/assumption flagged in source input: the confirmed understanding originally called for email verification on sign-up, but since email sending (SendGrid) was removed from the approved stack, there is no delivery mechanism for verification emails. Email verification is therefore excluded from this version (NFR-011, accepted risk) -- recommend product owner re-confirm this is acceptable long-term.

### EPIC-002 · approved · source: requirements:EPIC-002

Users upload supported document types which are asynchronously parsed, chunked, embedded with gemini-embedding-001, and stored in pgvector, with a per-document status visible to the user.

- US-004 (critical) Upload a document: AC-009 supported type within ~25MB accepted, linked to account, queued; AC-010 unsupported type (e.g. image, CSV, Excel) rejected with list of supported types; AC-011 oversized file rejected with max-size message.
- US-005 (critical) Process into vector store: AC-012 text extracted, chunked, embedded with gemini-embedding-001, stored in pgvector linked to document and user; AC-013 parsing/embedding failure (e.g. scanned-only PDF, Gemini API error) marks document failed with reason, no partial embeddings remain usable.
- US-006 (high) Per-document status: AC-014 status shown as processing/ready/failed; AC-015 non-ready documents cannot be selected for chat until ready.
- NFR-006: ingestion is asynchronous, upload returns immediately, workers process in background. NFR-009: per-file size cap ~25MB.
Out of scope for this epic: OCR of scanned PDFs/images; querying of spreadsheet/tabular data (CSV/Excel).

**Related:** US-004, US-005, US-006, AC-009, AC-010, AC-011, AC-012, AC-013, AC-014, AC-015, NFR-006, NFR-009

### EPIC-003 · approved · source: requirements:EPIC-003

Users can view, rename, and delete their own documents; deletion also removes the document's embeddings so it is no longer retrievable.

- US-007 (high) View documents: AC-016 user sees only own documents with name and status; AC-017 empty state prompts upload when none exist.
- US-008 (medium) Rename document: AC-018 non-empty new name saved and reflected everywhere including citations; AC-019 empty name rejected, existing name kept.
- US-009 (high) Delete document and embeddings: AC-020 document, stored text/chunks and embeddings removed from vector store; AC-021 deleted document's content no longer retrieved or cited in future answers.
- NFR-005: deletion permanently removes stored text, chunks and embeddings.

**Related:** US-007, US-008, US-009, AC-016, AC-017, AC-018, AC-019, AC-020, AC-021, NFR-005

### EPIC-004 · approved · source: requirements:EPIC-004

Users create multiple chat sessions scoped to one or more of their ready documents, with persistent history, and can view, rename, and delete sessions.

- US-010 (critical) Create session scoped to documents: AC-022 session created and scoped to selected ready documents; AC-023 no documents selected means questions cannot be asked yet.
- US-011 (high) View sessions and history: AC-024 reopening a session shows prior messages in order, persisted across sign-ins; AC-025 empty state prompts starting a new session when none exist.
- US-012 (low) Rename session: AC-026 non-empty new name saved and shown in sessions list.
- US-013 (medium) Delete session: AC-027 confirmed deletion removes session and all its messages from the list; AC-028 the session's documents remain available and are not deleted.

**Related:** US-010, US-011, US-012, US-013, AC-022, AC-023, AC-024, AC-025, AC-026, AC-027, AC-028

### EPIC-005 · approved · source: requirements:EPIC-005

Questions are answered by gemini-2.5-flash grounded only in retrieved chunks from the selected documents, with citations, a graceful not-found reply, and use of prior session messages as context.

- US-014 (critical) Ask and get grounded answer: AC-029 relevant chunks retrieved from selected ready documents, gemini-2.5-flash answers based only on those chunks; AC-030 answer does not introduce facts absent from retrieved chunks.
- US-015 (high) Source citations: AC-031 answer includes citations identifying source document(s).
- US-016 (high) Graceful not-found reply: AC-032 assistant states it cannot find the answer in the selected documents rather than guessing, when the answer is absent.
- US-017 (medium) Conversational context: AC-033 assistant uses prior session messages as context for follow-up questions while still grounding answers only in retrieved chunks.
- NFR-007: answers stream progressively to the user during a live session.

**Related:** US-014, US-015, US-016, US-017, AC-029, AC-030, AC-031, AC-032, AC-033, NFR-007

### EPIC-006 · approved · source: requirements:EPIC-006

All documents, embeddings, sessions and messages are strictly isolated per user; cross-user access by identifier is denied, and unauthenticated requests return no data.

- US-018 (critical) Access only my own data: AC-034 user only ever sees own documents/sessions, never another user's; AC-035 attempting to access another user's document/session/message id is denied; AC-036 unauthenticated requests to any user-data endpoint/page require authentication and return no data.
- NFR-004: strict per-user isolation across all data types. NFR-012 (accepted risk): industry treated as 'general' -- no sector-specific regulatory requirements (e.g. healthcare, finance) are designed for; only standard privacy practices apply.

**Related:** US-018, AC-034, AC-035, AC-036, NFR-002, NFR-004, NFR-012

- ⚠ Industry/domain is explicitly 'general' with no specific regulatory skill or compliance framework supplied in this input, so no regulation-specific traceability could be checked. If the product later ingests regulated data (health, financial, etc.), this assumption (NFR-012) should be revisited with the appropriate compliance requirements.

### EPIC-007 · approved · source: requirements:EPIC-007

The product is free at launch; per-user caps on document count/size and message volume control Gemini API costs, with no billing presented.

- US-019 (medium) Enforce usage limits: AC-037 upload blocked with a limit-reached message once a user hits the configured max document count/size; AC-038 message sending blocked with a limit-reached message once max messages for the period is hit; AC-039 no charge or billing step presented while within limits, since the product is free at launch.

**Related:** US-019, AC-037, AC-038, AC-039

- ⚠ Specific numeric values for the per-user limits (max documents, max total size, max messages per period) are described as 'configurable' but no concrete numbers are given in this input.

### EPIC-008 · approved · source: requirements:EPIC-008

A responsive web dashboard lists the user's documents (with status) and chat sessions, with entry points to upload, manage, and chat, reflowing usably on mobile viewports. No native mobile/desktop apps.

- US-020 (high) Responsive dashboard: AC-040 dashboard shows documents with status and chat sessions, with entry points to upload/manage/start or open chats; AC-041 on small (mobile) viewports the layout reflows to remain usable without horizontal scrolling or broken controls.
- NFR-010: responsive web app only across common desktop and mobile browser sizes; no native apps.

**Related:** US-020, AC-040, AC-041, NFR-010

### REQ-NFR-SUMMARY · approved · source: requirements:non-functional-requirements

Twelve non-functional requirements span security, privacy, performance, usability, scalability, compatibility, and compliance, including two explicitly accepted risks.

- NFR-001 (security) Minimum password strength at sign-up.
- NFR-002 (security) Session-based authentication required for all user-data access.
- NFR-003 (security) Generic invalid-credentials message on sign-in failure.
- NFR-004 (privacy) Strict per-user data isolation across documents, embeddings, sessions, messages.
- NFR-005 (privacy) Complete removal of a user's data on document/account deletion, including embeddings.
- NFR-006 (performance) Asynchronous ingestion with background processing and visible status.
- NFR-007 (usability) Streaming chat answers for responsiveness.
- NFR-008 (scalability) Sized for tens to low-hundreds of early users, not thousands concurrent.
- NFR-009 (scalability) ~25MB per-file upload cap.
- NFR-010 (compatibility) Responsive web app only, reflows on mobile; no native apps.
- NFR-011 (security, accepted risk) No email verification at launch (email sending removed from scope).
- NFR-012 (compliance, accepted risk) No sector-specific regulatory controls; industry treated as general.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-009, US-014, US-018, US-020
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-10-27

**Capabilities in scope:** User account sign-up and sign-in, Document upload (PDF, Word, PowerPoint, text, markdown), Document parsing, chunking and embedding into the vector store, Chat session creation with selection of one or more documents, Grounded question answering from the selected documents, Source document citations on each answer, Graceful 'not found' reply when the answer isn't in the documents, Conversational context from earlier messages in the session, Persistent chat history across multiple sessions, Per-user data isolation (each user sees only their own content), Manage documents: view, rename, delete (removes embeddings on delete), Manage chat sessions: view, rename, delete, Account deletion with removal of the user's data, Responsive dashboard listing a user's documents and chat sessions, Google gemini-2.5-flash for generating answers, gemini-embedding-001 for document embeddings, Free to use at launch with no billing

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | The whole product is a document pipeline plus LLM calls: parsing PDF/Word/PowerPoint, chunking, embedding with gemini-embedding-001, retrieval and calling gemini-2.5-flash. That ecosystem (Google's SDK, document parsers, RAG tooling) is strongest in Python, so FastAPI lets you build the core features with the least glue code. It also supports streaming responses for the chat and background work for async ingestion, which you need. |
| cloud | AWS | You need durable file storage for uploaded documents (up to ~25MB each), a managed PostgreSQL with pgvector, and somewhere to run the app and ingestion workers. AWS provides all of this (S3, RDS, container/compute) with a free tier that suits tens to low-hundreds of users, and it is the most widely supported target, so hiring and troubleshooting are easy. |
| database | PostgreSQL | You need to store users, documents, chunks, chat sessions and messages with strict per-user isolation, and you need the vector store for embeddings. PostgreSQL does both: relational data for accounts and chats plus pgvector for semantic search in one database. That means one system to run, back up and enforce isolation in — ideal for a fast MVP and easy account/data deletion. |
| frontend | React | Your product is a responsive web app with no native mobile/desktop apps, and the chat experience is interactive: live chat sessions, streaming answers, per-document upload status that updates as files are processed, and document/session management screens. React handles this kind of stateful, frequently-updating interface well and has the largest pool of developers and ready-made UI components, which keeps a quickly-launched MVP quick. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: User Accounts & Authentication

Public sign-up and sign-in using email and password, with session-based authentication, so that any visitor can create an account and securely access only their own data. Assumption: email+password authentication with no SSO/social login at launch. Assumption/conflict: the confirmed understanding calls for email verification on sign-up, but email sending (SendGrid) was removed from the delivery scope; at launch there is therefore no delivery mechanism for verification emails, so email verification is not implemented in this version and accounts are usable immediately after sign-up.

### US-001: Sign up for an account

**Priority:** critical

> As a visitor, I want to create an account with my email address and a password, so that I can start uploading documents and chatting with them.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am a visitor on the sign-up page | I submit a unique email address and a password that meets the minimum strength rules | an account is created for me and I am signed in and taken to my dashboard |
| AC-002 | I am on the sign-up page | I submit an email address that already has an account | the account is not created and I see an error indicating the email is already registered |
| AC-003 | I am on the sign-up page | I submit an invalid email format or a password that does not meet the minimum rules | the account is not created and I see a validation message explaining what to fix |

### US-002: Sign in and sign out

**Priority:** critical

> As a registered user, I want to sign in with my email and password and sign out when finished, so that I can securely access my documents and chat sessions.

| ID | Given | When | Then |
|---|---|---|---|
| AC-004 | I have a registered account | I submit my correct email and password | I am authenticated with a session and taken to my dashboard |
| AC-005 | I am on the sign-in page | I submit an email/password combination that does not match any account | I am not signed in and I see a generic invalid-credentials message |
| AC-006 | I am signed in | I choose to sign out | my session is ended and I can no longer access authenticated pages without signing in again |

### US-003: Delete my account and data

**Priority:** high

> As a signed-in user, I want to permanently delete my account, so that all my documents, embeddings, chat sessions and messages are removed from the system.

| ID | Given | When | Then |
|---|---|---|---|
| AC-007 | I am signed in and on my account settings | I request account deletion and confirm the irreversible action | my account, all my documents and their embeddings, and all my chat sessions and messages are deleted and I am signed out |
| AC-008 | my account deletion has completed | I attempt to sign in with the deleted credentials | authentication fails because the account no longer exists |

## EPIC-002: Document Upload & Ingestion

Users upload their own text-based documents (PDF, Word, PowerPoint, plain text, markdown) which are asynchronously parsed to text, chunked, embedded with gemini-embedding-001 and stored in the vector store, with per-document processing status visible to the user. Assumptions: embeddings use gemini-embedding-001 via the Gemini API (requires a GOOGLE_API_KEY); the vector store is pgvector on PostgreSQL; a per-file size limit of ~25MB applies; ingestion is asynchronous. Out of scope: OCR of scanned images/PDFs and querying of spreadsheet/tabular data.

### US-004: Upload a document

**Priority:** critical

> As a signed-in user, I want to upload a PDF, Word, PowerPoint, plain text or markdown file, so that I can later chat with its contents.

| ID | Given | When | Then |
|---|---|---|---|
| AC-009 | I am signed in on my dashboard | I upload a file of a supported type within the ~25MB per-file size limit | the file is accepted, associated with my account, and queued for asynchronous processing |
| AC-010 | I am uploading a file | the file type is not one of the supported types (e.g. an image, CSV or Excel file) | the upload is rejected and I see a message listing the supported document types |
| AC-011 | I am uploading a file | the file exceeds the ~25MB per-file size limit | the upload is rejected and I see a message stating the maximum allowed size |

### US-005: Process documents into the vector store

**Priority:** critical

> As a signed-in user, I want my uploaded documents to be parsed, chunked and embedded automatically, so that their content becomes searchable for grounded answers.

| ID | Given | When | Then |
|---|---|---|---|
| AC-012 | a supported document I uploaded has been accepted | asynchronous processing runs | the document text is extracted, split into chunks, embedded with gemini-embedding-001 and stored in the pgvector store linked to the document and my account |
| AC-013 | a document fails during parsing or embedding (for example an unreadable or scanned-only PDF with no extractable text, or a Gemini API error) | processing cannot complete | the document is marked as failed with a reason and no partial embeddings remain that would be used for answering |

### US-006: See per-document processing status

**Priority:** high

> As a signed-in user, I want to see the processing status of each document, so that I know when a document is ready to chat with.

| ID | Given | When | Then |
|---|---|---|---|
| AC-014 | I have uploaded a document that is being processed asynchronously | I view my document list | the document shows a status such as processing, ready, or failed |
| AC-015 | a document's status is not ready | I try to select it for a chat session | I cannot use it for answering until it reaches the ready state |

## EPIC-003: Document Management

Users can view, rename and delete their own documents, with deletion also removing the document's embeddings from the vector store. Assumption: deleting a document removes its embeddings so it can no longer be used for answering.

### US-007: View my documents

**Priority:** high

> As a signed-in user, I want to see a list of the documents I have uploaded, so that I can manage them and choose which to chat with.

| ID | Given | When | Then |
|---|---|---|---|
| AC-016 | I am signed in and have uploaded documents | I open my document list | I see only my own documents with their name and processing status |
| AC-017 | I am signed in with no documents uploaded | I open my document list | I see an empty state prompting me to upload a document |

### US-008: Rename a document

**Priority:** medium

> As a signed-in user, I want to rename one of my documents, so that I can give it a clearer label.

| ID | Given | When | Then |
|---|---|---|---|
| AC-018 | I own a document | I rename it to a non-empty name | the new name is saved and shown wherever the document is listed, including as a citation source |
| AC-019 | I am renaming a document | I submit an empty name | the rename is rejected and the existing name is kept |

### US-009: Delete a document and its embeddings

**Priority:** high

> As a signed-in user, I want to delete a document I no longer need, so that it and its embeddings are removed and no longer used for answers.

| ID | Given | When | Then |
|---|---|---|---|
| AC-020 | I own a document | I delete it and confirm | the document, its stored text/chunks and its embeddings are removed from the vector store |
| AC-021 | I have deleted a document | I ask a question in a session that previously included that document | the deleted document's content is no longer retrieved or cited in answers |

## EPIC-004: Chat Sessions

Users create multiple chat sessions, each scoped to one or more of their own documents, with history persisted per user. Users can view, rename and delete sessions. Assumption: a session's answers are retrieved only from the documents selected for that session.

### US-010: Create a chat session scoped to selected documents

**Priority:** critical

> As a signed-in user, I want to start a new chat session and select one or more of my documents to chat with, so that my questions are answered from exactly the documents I chose.

| ID | Given | When | Then |
|---|---|---|---|
| AC-022 | I am signed in and have at least one document in the ready state | I create a new session and select one or more ready documents | a session is created scoped to those documents and I can begin asking questions |
| AC-023 | I am creating a session | I select no documents | I cannot start asking questions until at least one document is selected |

### US-011: View my chat sessions and their history

**Priority:** high

> As a signed-in user, I want to see my list of chat sessions and reopen a session's full message history, so that I can continue previous conversations.

| ID | Given | When | Then |
|---|---|---|---|
| AC-024 | I have existing chat sessions | I open my sessions list and select one | the session opens showing its previous messages in order, persisted across sign-ins |
| AC-025 | I am signed in with no sessions | I open my sessions list | I see an empty state prompting me to start a new session |

### US-012: Rename a chat session

**Priority:** low

> As a signed-in user, I want to rename a chat session, so that I can identify its topic later.

| ID | Given | When | Then |
|---|---|---|---|
| AC-026 | I own a chat session | I rename it to a non-empty name | the new name is saved and shown in my sessions list |

### US-013: Delete a chat session

**Priority:** medium

> As a signed-in user, I want to delete a chat session, so that I can remove conversations I no longer want.

| ID | Given | When | Then |
|---|---|---|---|
| AC-027 | I own a chat session | I delete it and confirm | the session and all its messages are removed and it no longer appears in my sessions list |
| AC-028 | I have deleted a session | the session's documents still exist | those documents remain available and are not deleted |

## EPIC-005: Grounded Question Answering

Within a session, questions are answered by gemini-2.5-flash grounded only in chunks retrieved from the selected documents, with source citations, a graceful 'not found' reply when the answer is absent, and conversational context from earlier messages in the session. Assumption: answers use gemini-2.5-flash via the Gemini API (requires a GOOGLE_API_KEY) and are grounded solely in retrieved chunks.

### US-014: Ask a question and get a grounded answer

**Priority:** critical

> As a signed-in user, I want to ask a question in a session and receive an answer grounded in my selected documents, so that I get reliable information from my own content.

| ID | Given | When | Then |
|---|---|---|---|
| AC-029 | I am in a session scoped to one or more ready documents | I ask a question whose answer is contained in those documents | relevant chunks are retrieved from the selected documents and gemini-2.5-flash returns an answer based only on those chunks |
| AC-030 | a question has been answered | I view the assistant's reply | the answer does not introduce facts that are absent from the retrieved chunks of the selected documents |

### US-015: See source citations on answers

**Priority:** high

> As a signed-in user, I want each answer to cite which of my documents it came from, so that I can verify the source.

| ID | Given | When | Then |
|---|---|---|---|
| AC-031 | the assistant produces an answer from retrieved chunks | I read the answer | it includes citations identifying the source document(s) the answer was drawn from |

### US-016: Graceful 'not found' reply

**Priority:** high

> As a signed-in user, I want the assistant to tell me when the answer isn't in my documents, so that I am not given fabricated information.

| ID | Given | When | Then |
|---|---|---|---|
| AC-032 | I am in a session scoped to selected documents | I ask a question whose answer is not present in those documents | the assistant responds that it cannot find the answer in the selected documents rather than guessing |

### US-017: Use earlier messages as conversational context

**Priority:** medium

> As a signed-in user, I want the assistant to take my earlier messages in the session into account, so that I can ask natural follow-up questions.

| ID | Given | When | Then |
|---|---|---|---|
| AC-033 | I have an ongoing session with previous exchanges | I ask a follow-up question that refers to an earlier message | the assistant uses the prior session messages as context while still grounding the answer only in retrieved chunks from the selected documents |

## EPIC-006: Per-User Data Isolation & Privacy

All data is isolated per user so each user can only access their own documents, embeddings, sessions and messages. Assumption: industry is 'general', so no sector-specific regulatory requirements apply; standard privacy practices apply to user-uploaded content.

### US-018: Access only my own data

**Priority:** critical

> As a signed-in user, I want to be prevented from accessing any other user's documents or chats, so that my content stays private and I never see others' content.

| ID | Given | When | Then |
|---|---|---|---|
| AC-034 | another user owns documents and chat sessions | I am signed in and browse the application | I only ever see my own documents and sessions, never theirs |
| AC-035 | I am signed in | I attempt to access a document, session or message identifier that belongs to another user | the request is denied and the other user's data is not returned |
| AC-036 | I am not signed in | I attempt to access any user data endpoint or page | I am required to authenticate and no data is returned |

## EPIC-007: Usage Limits (Free at Launch)

The product is free to use at launch with no billing, and per-user usage limits (document count/size and message volume) control Gemini API costs. Assumptions: no billing in this version; specific limit values are configurable and intended for tens to low-hundreds of early users.

### US-019: Enforce per-user usage limits

**Priority:** medium

> As a platform operator, I want per-user caps on documents and messages to be enforced, so that Gemini API costs stay controlled while the product is free.

| ID | Given | When | Then |
|---|---|---|---|
| AC-037 | a user has reached the configured maximum number or total size of documents | they attempt to upload another document | the upload is blocked and the user is told they have reached their document limit |
| AC-038 | a user has reached the configured maximum number of messages for the applicable period | they attempt to send another message | the message is blocked and the user is told they have reached their usage limit |
| AC-039 | a user is within their limits | they use the product | no charge or billing step is presented because the product is free at launch |

## EPIC-008: Responsive Dashboard

A responsive web dashboard lists the signed-in user's documents and chat sessions and provides access to upload, management and chat actions across common screen sizes. Out of scope: native mobile and desktop applications — responsive web app only.

### US-020: View a responsive dashboard of my documents and sessions

**Priority:** high

> As a signed-in user, I want a dashboard listing my documents and chat sessions that works on different screen sizes, so that I can manage and use the app from desktop or mobile browsers.

| ID | Given | When | Then |
|---|---|---|---|
| AC-040 | I am signed in | I open my dashboard | I see my documents (with status) and my chat sessions, with entry points to upload, manage and start or open chats |
| AC-041 | I open the dashboard on a small (mobile) viewport | the layout renders | the content reflows to remain usable without horizontal scrolling or broken controls |
<!-- sdlc:auto:end epics -->
