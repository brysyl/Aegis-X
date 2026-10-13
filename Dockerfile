# -----------------------------------------------------------------------------
# Aegis-X: Real-Time Edge Security Gateway & ATO Sentinel
# Multi-stage optimized Dockerfile for Google Cloud Run & Serverless Deployment
# -----------------------------------------------------------------------------

# Stage 1: Build & Dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# Install minimal build essentials
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --user -r requirements.txt


# Stage 2: Final Minimal Runtime Image
FROM python:3.11-slim AS runtime

# Set security and operational environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/home/appuser/.local/bin:$PATH" \
    PORT=8080 \
    APP_ENV=production

WORKDIR /app

# Create unprivileged application user
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -m -s /bin/bash appuser

# Copy installed Python packages from builder
COPY --from=builder /root/.local /home/appuser/.local

# Copy application source code
COPY --chown=appuser:appgroup main.py detector.py redis_client.py requirements.txt ./
COPY --chown=appuser:appgroup templates/ ./templates/

# Ensure proper permissions
RUN chown -R appuser:appgroup /app /home/appuser

USER appuser

# Google Cloud Run injects $PORT (default 8080)
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:' + str(__import__('os').getenv('PORT', 8080)) + '/healthz').read()" || exit 1

# Launch production Uvicorn server bound to $PORT
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 2 --loop uvloop --http httptools --access-log
