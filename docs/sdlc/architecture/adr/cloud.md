<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-10-27

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v2.

## Considered Options

- AWS
- GCP
- Azure

## Decision Outcome

Chosen option: AWS, because Provides S3 for durable ~25MB document storage, RDS PostgreSQL with pgvector, and compute for the API and worker, with a free tier suited to early scale.

## Consequences

Gemini is a Google SaaS called over HTTPS from AWS, which is fine; cross-cloud latency to the API is negligible for this workload.
<!-- sdlc:auto:end adr -->