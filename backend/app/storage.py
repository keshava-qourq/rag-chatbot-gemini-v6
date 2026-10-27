"""Storage for original uploaded documents (up to ~25MB each).

One small module, two backends, exactly as the architecture requires: Amazon
S3 when ``S3_BUCKET`` is set (every real deployment), the local filesystem
under ``MEDIA_ROOT`` otherwise (tests, a laptop). Nothing importing this
module needs to know which one is active, and the development sprint's
document-upload ticket (US-004) is the first thing that will.
"""

import os
import uuid
from pathlib import Path

MEDIA_ROOT = Path(os.getenv("MEDIA_ROOT", "./media"))
S3_BUCKET = os.getenv("S3_BUCKET", "")
AWS_REGION = os.getenv("AWS_REGION", "")

# How long a presigned download URL stays valid.
PRESIGNED_URL_EXPIRES_IN = 900


def _s3_client():
    # Imported lazily so a MEDIA_ROOT-only run (no S3_BUCKET, e.g. tests on a
    # laptop) never has to reach boto3's credential resolution at all.
    import boto3

    return boto3.client("s3", region_name=AWS_REGION or None)


def new_object_key(user_id: str, filename: str) -> str:
    """A storage key unique to this upload, namespaced by its owner."""
    suffix = Path(filename).suffix
    return f"documents/{user_id}/{uuid.uuid4()}{suffix}"


def put(key: str, body: bytes) -> None:
    """Store ``body`` under ``key``."""
    if S3_BUCKET:
        _s3_client().put_object(Bucket=S3_BUCKET, Key=key, Body=body)
        return
    path = MEDIA_ROOT / key
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(body)


def get(key: str) -> bytes:
    """The bytes stored under ``key``."""
    if S3_BUCKET:
        response = _s3_client().get_object(Bucket=S3_BUCKET, Key=key)
        return response["Body"].read()
    return (MEDIA_ROOT / key).read_bytes()


def delete(key: str) -> None:
    """Remove the object at ``key``. Never errors if it is already gone."""
    if S3_BUCKET:
        _s3_client().delete_object(Bucket=S3_BUCKET, Key=key)
        return
    (MEDIA_ROOT / key).unlink(missing_ok=True)


def url_for(key: str) -> str:
    """A short-lived, never-public URL to fetch ``key``.

    S3: a presigned GET URL. Local: a path under the API's own ``/media``
    mount -- the development sprint serves ``MEDIA_ROOT`` there -- never a
    raw filesystem path.
    """
    if S3_BUCKET:
        return _s3_client().generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": key},
            ExpiresIn=PRESIGNED_URL_EXPIRES_IN,
        )
    return f"/media/{key}"
