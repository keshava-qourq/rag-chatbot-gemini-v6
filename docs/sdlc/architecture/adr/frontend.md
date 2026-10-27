<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-10-27

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v2.

## Considered Options

- React 19
- Vue
- Svelte

## Decision Outcome

Chosen option: React 19, because Builds the stateful, frequently-updating UI this product needs: live document-status polling, session management and streaming chat rendering, consuming the server-sent token stream from the message endpoint.

## Consequences

A SPA needs its own build/hosting and client-side routing; large component ecosystem offsets this. Responsive layout handled with CSS for desktop and mobile (NFR-010).
<!-- sdlc:auto:end adr -->