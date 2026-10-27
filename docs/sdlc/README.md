# Rag_chatbot_gemini_v6 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
Build a rag chatbot where user can upload there own documents and ask queries about them use gemini-2.5-flash for answers and gemini-embedding-001 for embeddings and have chat history and sessions

**Documentation version:** v2
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 22 entries |
| [Development](development/README.md) | 0 entries |
| [Testing](testing/README.md) | 0 entries |
| [Deployment](deployment/README.md) | 0 entries |
| [Maintenance](maintenance/README.md) | 0 entries |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | not generated yet |
| [Developer guide](development/developer-guide.md) | not generated yet |
| [API reference](development/api-reference.md) | 0 routes |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 0 tests |
| [Deployment guide](deployment/deployment-guide.md) | not deployed yet |
| [Runbook](deployment/runbook.md) | not deployed yet |
| [Release notes](deployment/release-notes.md) | 0 releases |
| [Traceability matrix](traceability-matrix.md) | 20 requirements |
| [Changelog](CHANGELOG.md) | 2 versions |
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
<!-- sdlc:auto:end open-gaps -->
