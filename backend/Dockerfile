FROM python:3.12-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY alembic.ini ./
COPY alembic ./alembic

# MEDIA_ROOT's local fallback (see app/storage.py) when S3_BUCKET is unset;
# the platform mounts the real MEDIA_ROOT over this when it sets one.
RUN mkdir -p /app/media

# Run as an unprivileged user. The service never needs root, and a container that
# drops it limits what a compromise of the app can do to the host.
RUN useradd --create-home --uid 10001 appuser && chown -R appuser:appuser /app/media
USER appuser

EXPOSE 8000

# Reports the container unhealthy when the app stops answering. Uses the Python
# standard library rather than curl, which the slim base image does not ship.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=3)"

# Alembic owns the schema (see backend/alembic/): apply every migration
# before the app can start serving a schema it does not match. Safe to run
# on every boot -- already-applied revisions are a no-op.
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
