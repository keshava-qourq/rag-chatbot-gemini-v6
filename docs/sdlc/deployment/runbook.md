# Runbook

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start health -->
- Backend: `https://100-21-195-106.sslip.io/apps/dc589fbd1d33/health`
- Frontend: https://pdc589fbd1d33.d3j61xaup4zgrx.amplifyapp.com
<!-- sdlc:auto:end health -->

<!-- sdlc:auto:start deploy -->
Push to `main` to run `.github/workflows/deploy.yml`, or start a deployment from the platform's Deployment tab.
<!-- sdlc:auto:end deploy -->

<!-- sdlc:auto:start rollback -->
Redeploy the last good version from the platform's Deployment tab, or revert the offending commit on `main` — the workflow redeploys.

**Last live version:** 16a6712eefb6 (`16a6712`)
<!-- sdlc:auto:end rollback -->

<!-- sdlc:auto:start recent-failures -->
| Date | Version | Summary |
|---|---|---|
| 2026-10-27 | b9c4c477838c | The deploy workflow could not be restored: This project's AWS stack is not ready yet. |
<!-- sdlc:auto:end recent-failures -->

## Contacts and escalation

_Add on-call contacts here — this section is never overwritten._
