# Rag_chatbot_gemini_v6 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
Build a rag chatbot where user can upload there own documents and ask queries about them use gemini-2.5-flash for answers and gemini-embedding-001 for embeddings and have chat history and sessions

**Documentation version:** v4
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 22 entries |
| [Development](development/README.md) | 14 entries |
| [Testing](testing/README.md) | 0 entries |
| [Deployment](deployment/README.md) | 1 entry |
| [Maintenance](maintenance/README.md) | 0 entries |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 5 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 1 route |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 0 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 1 release |
| [Traceability matrix](traceability-matrix.md) | 20 requirements |
| [Changelog](CHANGELOG.md) | 4 versions |
<!-- sdlc:auto:end contents -->

## Open gaps

<!-- sdlc:auto:start open-gaps -->
### Requirements

- Conflict/assumption flagged in source input: the confirmed understanding originally called for email verification on sign-up, but since email sending (SendGrid) was removed from the approved stack, there is no delivery mechanism for verification emails. Email verification is therefore excluded from this version (NFR-011, accepted risk) -- recommend product owner re-confirm this is acceptable long-term.
- Industry/domain is explicitly 'general' with no specific regulatory skill or compliance framework supplied in this input, so no regulation-specific traceability could be checked. If the product later ingests regulated data (health, financial, etc.), this assumption (NFR-012) should be revisited with the appropriate compliance requirements.
- Specific numeric values for the per-user limits (max documents, max total size, max messages per period) are described as 'configurable' but no concrete numbers are given in this input.

### Architecture

- No explicit traceability from this architecture document to specific US-00x requirement ids was provided -- mapping below is inferred from functional description only, not stated directly in the input.
- Numeric usage-limit thresholds and password-strength rules are referenced but not quantified in this input.
- Specific supported file size/type limits and per-user document limits are referenced but not numerically specified in this input.
- Retrieval parameters (e.g. top-k, similarity threshold) are not specified.
- Password strength rules and session lifetime/expiry policy are referenced but not detailed.
- No email verification at launch is stated as a deliberate decision, not a gap, but is noted here for completeness.
- usage_counters period semantics (what resets period_started_at and how often) are not defined in this input.
- The exact message-limit value and its reset cadence are not specified.
- No networking/VPC, scaling, or environment-promotion details are given for these nodes.
- NFR-007 is referenced by the architecture input but is not among the known requirement keys provided, so it could not be linked via related_ids.
- NFR-004 and NFR-005 are referenced by the architecture input but are not among the known requirement keys provided, so they could not be linked via related_ids.
- Development has not been reported as complete -- only architecture input is available for this phase -- so there is no built application yet to document usage for. A full screen-by-screen user guide should be produced once development/testing confirms the UI and behavior described in the architecture (upload, document status, session management, streaming grounded chat with citations).

### Development

- No record of actual sprint execution, burndown, or completion status against this plan.
- No dates given for plan approval or sprint start/end.
- Plan input does not explicitly assign backlog item IDs to this sprint; mapping above is inferred from goal text, not stated.
- No completion/progress status for this sprint reported.
- Sprint-to-item mapping inferred from goal text only; plan input gives no explicit assignment.
- No progress/completion status reported for this sprint.
- Sprint-to-item mapping inferred from goal text only; not explicitly stated in the plan input.
- Sprint-to-item mapping inferred from goal text only; not explicitly assigned in the plan input.
- Possible discrepancy: US-003 is listed under EPIC-001 (Sprint 1 theme) but its goal text ('full account deletion') matches Sprint 4 instead -- flagging for confirmation of actual sprint placement.
- No progress/completion status reported for this sprint; this is the final planned sprint and no outcome data is available.
- No implementation status, code, or test evidence provided for any item in this epic.
- No detail given on which vector store schema or failure-handling behavior was actually implemented for US-005-T4.
- No detail on prompt design, citation format, or streaming behavior beyond the task titles.
- No results of the planned cross-user isolation test suite (US-018-T2) or authorization audit (US-018-T3) have been reported.
- No implementation status, code, or test evidence provided.
- Specific limit thresholds (e.g. requests/day, storage caps) are not defined in this input.
- No detail on specific dashboard layout, widgets, or responsive breakpoints.

### Deployment

- No deployment date/timestamp provided.
- No record of who approved or executed this deployment.
- No mapping of this deployment to specific requirement IDs (US-001..US-020) or tickets delivered in this version -- cannot confirm which user stories are live.
- No environment designation (production vs. staging vs. preview) given for either URL.
- No rollback plan, infrastructure/hosting details (e.g. container, region, scaling), or monitoring/alerting setup documented.
- No confirmation that automated tests passed prior to this deployment, since no testing phase input was supplied alongside this deployment record.
<!-- sdlc:auto:end open-gaps -->
