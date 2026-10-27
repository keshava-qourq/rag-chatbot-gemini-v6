"""Document CRUD endpoints: upload, list, rename, delete.

Stub handlers only -- S3 upload, usage-limit enforcement (413/415/403) and
enqueueing the ingestion job (`app.worker.ingest_document`) are the
development sprint's work (US-004, US-005, US-009). Every route is scoped to
the signed-in user once that handler exists; cross-user ids must then answer
404, per NFR-002/NFR-004.
"""

from fastapi import APIRouter, Depends

from app.schemas import StubResponse
from app.security import require_api_secret

router = APIRouter(tags=["documents"], dependencies=[Depends(require_api_secret)])


@router.post("/documents", response_model=StubResponse)
async def upload_document() -> StubResponse:
    """Upload a supported document within size and usage limits."""
    return StubResponse(endpoint="POST /documents")


@router.get("/documents", response_model=StubResponse)
async def list_documents() -> StubResponse:
    """List the signed-in user's documents with name and processing status."""
    return StubResponse(endpoint="GET /documents")


@router.get("/documents/{document_id}", response_model=StubResponse)
async def get_document(document_id: str) -> StubResponse:
    """Get one of the user's documents including status; denied if not owner."""
    return StubResponse(endpoint="GET /documents/{id}")


@router.patch("/documents/{document_id}", response_model=StubResponse)
async def rename_document(document_id: str) -> StubResponse:
    """Rename a document to a non-empty name."""
    return StubResponse(endpoint="PATCH /documents/{id}")


@router.delete("/documents/{document_id}", response_model=StubResponse)
async def delete_document(document_id: str) -> StubResponse:
    """Delete a document, its chunks, embeddings and S3 object."""
    return StubResponse(endpoint="DELETE /documents/{id}")
