"""Entry point for the ingestion worker: `arq app.worker.WorkerSettings`.

Consumes the jobs the documents router enqueues onto Redis: download the
original file from S3 (`app.storage`), parse it, chunk it, embed each chunk
with gemini-embedding-001, write chunks and embeddings to pgvector, then flip
the document's status to ready or failed. That pipeline is the development
sprint's work (US-004, US-005, US-006); this module only wires the arq
runtime -- its Redis connection, its registered jobs -- so both enqueueing a
job and running a worker process have somewhere real to point at from day
one, instead of a Redis queue nothing ever drains.
"""

import os

from arq.connections import RedisSettings

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")


async def ingest_document(ctx: dict, document_id: str) -> None:
    """Placeholder ingestion job.

    Keep this name and signature when implementing it: `app.routers.documents`
    enqueues jobs by name (`arq.connections.ArqRedis.enqueue_job("ingest_document",
    document_id)`), and jobs must be safe to run twice -- re-ingesting the same
    `document_id` should be idempotent, not append duplicate chunks.
    """
    raise NotImplementedError("ingestion is implemented by the development sprint")


class WorkerSettings:
    functions = [ingest_document]
    redis_settings = RedisSettings.from_dsn(REDIS_URL)
