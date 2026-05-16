# Docker Troubleshooting Guide — InterXAI

A project-specific troubleshooting guide for running InterXAI with Docker Compose. Every command and error in this document references the actual services, ports, and configuration found in this repository.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Quick Start Verification](#2-quick-start-verification)
3. [Common Errors & Fixes](#3-common-errors--fixes)
   - [Missing `.env` file](#31-missing-env-file)
   - [Port 8000 already in use](#32-port-8000-already-in-use)
   - [Port 6379 already in use](#33-port-6379-already-in-use)
   - [Redis connection refused in `api` or `taskiq_worker`](#34-redis-connection-refused-in-api-or-taskiq_worker)
   - [`uv pip install` fails during image build](#35-uv-pip-install-fails-during-image-build)
   - [`DATABASE_URL` SSL errors with SQLite](#36-database_url-ssl-errors-with-sqlite)
   - [`taskiq_worker` exits immediately](#37-taskiq_worker-exits-immediately)
   - [`api` container starts but returns 500 errors](#38-api-container-starts-but-returns-500-errors)
   - [Bind-mount volume permission errors](#39-bind-mount-volume-permission-errors)
   - [`ghcr.io/astral-sh/uv:latest` pull fails](#310-ghcrioastral-shuvlatest-pull-fails)
4. [Platform-Specific Notes](#4-platform-specific-notes)
   - [Windows (WSL2)](#windows-wsl2)
   - [macOS Apple Silicon (M1/M2/M3/M4)](#macos-apple-silicon-m1m2m3m4)
   - [Linux](#linux)
5. [Debug Commands](#5-debug-commands)
6. [Cleaning Up](#6-cleaning-up)
7. [Getting Help](#7-getting-help)

---

## 1. Prerequisites

Before running `docker-compose up`, make sure you have:

| Requirement | Minimum Version | Check Command |
|---|---|---|
| Docker Engine | 20.10+ | `docker --version` |
| Docker Compose | 2.0+ (V2 plugin) | `docker compose version` |
| Free port **8000** | — | `lsof -i :8000` (macOS/Linux) |
| Free port **6379** | — | `lsof -i :6379` (macOS/Linux) |
| `backend/.env` file | — | `ls backend/.env` |

### Create the `.env` file

The `api` and `taskiq_worker` services both require `backend/.env`. Create it from the example:

```bash
cp backend/.env.example backend/.env
```

Then fill in the required values:

```env
# Application
APP_NAME="InterXAI"
DEBUG=True
API_V1_PREFIX="/api/v1"

# Database — use your NeonDB PostgreSQL URL, or SQLite for quick local testing
# ⚠️  See Section 3.6 if using SQLite with Docker
DATABASE_URL="postgresql://user:password@your-neon-host/dbname"

# Security
SECRET_KEY="change-this-to-a-real-secret"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=3000

# Redis — inside Docker Compose, use the service name "redis", not "localhost"
REDIS_URL="redis://redis:6379/0"

# LLM (Groq) — required for resume evaluation
LLM_MODEL_NAME="groq/openai/gpt-oss-120b"
GROQ_API_KEY="your-groq-api-key"

# Supabase Storage — required for resume uploads
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-service-role-key"
SUPABASE_BUCKET_NAME="resumes"
```

> **Critical:** When running via Docker Compose, set `REDIS_URL=redis://redis:6379/0` (the hostname `redis` resolves to the Redis container on Docker's internal network). Using `localhost` will fail because each container has its own network namespace.

---

## 2. Quick Start Verification

### Start all services

```bash
# From the repository root
docker compose up --build
```

### Verify all three containers are running

```bash
docker compose ps
```

**Expected output:**

```
NAME                  SERVICE          STATUS
interxai-api-1        api              running   0.0.0.0:8000->8000/tcp
interxai-redis-1      redis            running   0.0.0.0:6379->6379/tcp
interxai-taskiq_worker-1  taskiq_worker  running
```

All three services (`api`, `taskiq_worker`, `redis`) should show `running`.

### Health check

```bash
curl http://localhost:8000/health
```

**Expected response:**

```json
{"status": "healthy", "app": "InterXAI", "version": "0.1.0"}
```

### Verify API docs load

Open in your browser: **http://localhost:8000/docs** (Swagger UI) or **http://localhost:8000/redoc** (ReDoc).

### Verify Redis connectivity

```bash
docker compose exec redis redis-cli ping
```

**Expected output:** `PONG`

---

## 3. Common Errors & Fixes

### 3.1 Missing `.env` file

**Error message:**

```
service "api" refers to undefined env_file ./backend/.env: stat backend/.env: no such file or directory
```

**Why it happens:** Both the `api` and `taskiq_worker` services specify `env_file: ./backend/.env` in `docker-compose.yml`. Docker Compose fails at startup if the file doesn't exist.

**Fix:**

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and fill in your actual credentials
```

---

### 3.2 Port 8000 already in use

**Error message:**

```
Error starting userland proxy: listen tcp4 0.0.0.0:8000: bind: address already in use
```

**Why it happens:** Another process (a local `uvicorn` dev server, another container, etc.) is already bound to port 8000.

**Fix:**

```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process (replace <PID> with the actual PID)
kill -9 <PID>

# Then retry
docker compose up --build
```

Or, temporarily remap the port without editing `docker-compose.yml`:

```bash
API_PORT=9000 docker compose up --build
```

> Note: The above override only works if you modify the compose file to use `${API_PORT:-8000}:8000`. Otherwise, stop the conflicting process first.

---

### 3.3 Port 6379 already in use

**Error message:**

```
Error starting userland proxy: listen tcp4 0.0.0.0:6379: bind: address already in use
```

**Why it happens:** A local Redis server is already running on port 6379.

**Fix:**

```bash
# macOS (Homebrew)
brew services stop redis

# Linux (systemd)
sudo systemctl stop redis-server

# Then retry
docker compose up --build
```

---

### 3.4 Redis connection refused in `api` or `taskiq_worker`

**Error message (in `api` or `taskiq_worker` logs):**

```
ConnectionRefusedError: [Errno 111] Connection refused
# or
redis.exceptions.ConnectionError: Error while reading from redis://localhost:6379/0
```

**Why it happens:** `REDIS_URL` in `backend/.env` is set to `redis://localhost:6379/0`. Inside a Docker container, `localhost` refers to the container itself, not the host machine or the Redis container.

**Fix:** Update `backend/.env`:

```env
# ✅ Correct — uses the Docker Compose service name
REDIS_URL="redis://redis:6379/0"

# ❌ Wrong — "localhost" won't reach the Redis container
# REDIS_URL="redis://localhost:6379/0"
```

Then restart:

```bash
docker compose down
docker compose up --build
```

---

### 3.5 `uv pip install` fails during image build

**Error message:**

```
error: Failed to download and build `asyncpg>=0.31.0`
# or
error: Failed to build `bcrypt>=4.0.0`
```

**Why it happens:** Both `asyncpg` and `bcrypt` include C extensions that require system-level build dependencies. The `python:3.12-slim` base image strips most build tools.

**Fix:** If you encounter build failures for native extensions, add build dependencies to both Dockerfiles (`backend/Dockerfile` and `backend/Dockerfile.taskiq`). Insert this line **before** the `RUN uv pip install` step:

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*
```

Then rebuild:

```bash
docker compose build --no-cache
docker compose up
```

---

### 3.6 `DATABASE_URL` SSL errors with SQLite

**Error message:**

```
TypeError: connect() got an unexpected keyword argument 'ssl'
# or
sqlite3.OperationalError: unable to open database file
```

**Why it happens:** The `database.py` file hardcodes `connect_args={"ssl": "require"}` for the database engine. This works with PostgreSQL (NeonDB) but causes an error with SQLite because the `aiosqlite` driver doesn't accept an `ssl` parameter.

**Fix — Option A (Recommended):** Use a PostgreSQL `DATABASE_URL` in `backend/.env`. The project is designed to connect to [NeonDB](https://neon.tech) (serverless PostgreSQL):

```env
DATABASE_URL="postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require"
```

**Fix — Option B (Local dev only):** If you want to use SQLite inside Docker, you'd need to modify `backend/app/database.py` to conditionally remove the `ssl` connect arg when the URL starts with `sqlite`. This is not recommended for Docker Compose usage.

---

### 3.7 `taskiq_worker` exits immediately

**Error message (in `taskiq_worker` logs):**

```
ModuleNotFoundError: No module named 'app.background.taskiq.tasks'
# or the container exits with code 1 and no output
```

**Why it happens:** The `taskiq_worker` container runs:

```
taskiq worker app.background.taskiq.taskiq:broker --tasks-pattern app/background/taskiq/tasks/*.py
```

If the bind mount (`./backend:/app`) fails or the task files are missing, the worker can't discover tasks and exits.

**Fix:**

1. Verify the task files exist locally:

    ```bash
    ls backend/app/background/taskiq/tasks/
    ```

2. Ensure the bind mount is working:

    ```bash
    docker compose exec taskiq_worker ls /app/app/background/taskiq/tasks/
    ```

3. If the container already exited, check its logs:

    ```bash
    docker compose logs taskiq_worker
    ```

---

### 3.8 `api` container starts but returns 500 errors

**Possible error in logs:**

```
app.exceptions.common.StorageException: Supabase client initialization failed
# or
app.exceptions.common.AIError: LLM provider initialization failed
```

**Why it happens:** The API starts successfully, but features that depend on external services (Supabase for resume storage, Groq for LLM inference) fail because the credentials in `backend/.env` are missing or invalid.

**Fix:** Verify these variables are set correctly in `backend/.env`:

```env
# Required for resume upload functionality
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-service-role-key"
SUPABASE_BUCKET_NAME="resumes"

# Required for AI-powered resume evaluation
GROQ_API_KEY="your-groq-api-key"
```

> **Note:** The `/health` endpoint and basic CRUD routes (users, organizations, interviews) will work without these keys. Only the resume processing pipeline (`POST /applications/{interview_id}`) requires Supabase and Groq.

---

### 3.9 Bind-mount volume permission errors

**Error message:**

```
PermissionError: [Errno 13] Permission denied: '/app/dev.db'
# or
PermissionError: [Errno 13] Permission denied: '/app/pyproject.toml'
```

**Why it happens:** The `docker-compose.yml` mounts `./backend:/app` as a bind volume. On Linux, the container runs as root by default, so previous container runs may leave files in `backend/` owned by `root`, which can prevent your host user from writing to them.

**Fix:**

```bash
# Reclaim ownership of the bind-mounted backend directory for your user
sudo chown -R "$(id -u)":"$(id -g)" backend/
# Ensure the owner can read and write the files
chmod -R u+rw backend/
```

---

### 3.10 `ghcr.io/astral-sh/uv:latest` pull fails

**Error message:**

```
ERROR: failed to solve: ghcr.io/astral-sh/uv:latest: failed to resolve source metadata
# or
unauthorized: authentication required
```

**Why it happens:** Both Dockerfiles use a multi-stage `COPY --from=ghcr.io/astral-sh/uv:latest` to get the `uv` binary. If GitHub Container Registry is down or your network blocks GHCR, the build fails.

**Fix:**

1. Verify you can reach GHCR:

    ```bash
    docker pull ghcr.io/astral-sh/uv:latest
    ```

2. If behind a corporate firewall/proxy, configure Docker's proxy settings in `~/.docker/config.json`:

    ```json
    {
      "proxies": {
        "default": {
          "httpProxy": "http://proxy:port",
          "httpsProxy": "http://proxy:port"
        }
      }
    }
    ```

3. Restart Docker after changing proxy settings.

---

## 4. Platform-Specific Notes

### Windows (WSL2)

Docker Desktop on Windows requires WSL2 as the backend. Native Windows containers are **not supported** for this project (the Dockerfiles use `python:3.12-slim`, a Linux image).

1. **Enable WSL2:**

    ```powershell
    wsl --install
    ```

2. **Install Docker Desktop** and ensure "Use the WSL 2 based engine" is checked in Settings → General.

3. **Clone the repo inside WSL2** (not on `/mnt/c/`):

    ```bash
    # Inside WSL2 terminal
    cd ~
    git clone https://github.com/Team-NoxVeil/InterXAI.git
    cd InterXAI
    ```

    > **Why?** Bind mounts from the Windows filesystem (`/mnt/c/`) into Linux containers are extremely slow and can cause file-watching issues. Cloning inside the WSL2 filesystem (`~/`) gives native performance.

4. **Line endings:** Ensure Git is configured to use LF line endings inside WSL2:

    ```bash
    git config --global core.autocrlf input
    ```

    CRLF line endings in shell scripts or Python files can cause `\r: command not found` errors inside containers.

5. **Port access:** Services exposed on `localhost:8000` and `localhost:6379` are accessible from both WSL2 and the Windows host via Docker Desktop's networking.

---

### macOS Apple Silicon (M1/M2/M3/M4)

1. **Image compatibility:** Both base images used in this project are compatible with ARM64:
   - `python:3.12-slim` — available for `linux/arm64`
   - `redis:7-alpine` — available for `linux/arm64`

   No `--platform linux/amd64` flag or Rosetta emulation is needed.

2. **Docker Desktop:** Use Docker Desktop 4.25+ for best Apple Silicon performance. Ensure "Use Rosetta for x86_64/amd64 emulation" is **disabled** (not needed for this project).

3. **Build cache:** If you switch between architectures (e.g., pulling images built on CI for `amd64`), clear the cache:

    ```bash
    docker builder prune -a
    docker compose build --no-cache
    ```

4. **Native dependency builds:** Packages like `asyncpg` and `bcrypt` (used by InterXAI) compile native extensions. On Apple Silicon, these build natively for ARM64 inside the `python:3.12-slim` container. If you encounter build failures, see [Section 3.5](#35-uv-pip-install-fails-during-image-build).

---

### Linux

1. **Docker permissions:** If you get `permission denied` when running `docker compose`, either:
   - Add your user to the `docker` group: `sudo usermod -aG docker $USER` (then log out and back in)
   - Or prefix commands with `sudo`

2. **Docker Compose V2:** Modern Linux installations use `docker compose` (space, V2 plugin). If you only have `docker-compose` (hyphen, standalone V1), upgrade:

    ```bash
    sudo apt-get update && sudo apt-get install docker-compose-plugin
    ```

---

## 5. Debug Commands

All commands below use the actual service names defined in `docker-compose.yml`: **`api`**, **`taskiq_worker`**, and **`redis`**.

### View live logs

```bash
# All services
docker compose logs -f

# API server only
docker compose logs -f api

# TaskIQ worker only
docker compose logs -f taskiq_worker

# Redis only
docker compose logs -f redis
```

### Check container status

```bash
docker compose ps
```

### Open a shell inside a running container

```bash
# API container
docker compose exec api bash

# TaskIQ worker container
docker compose exec taskiq_worker bash

# Redis container (Alpine — uses sh, not bash)
docker compose exec redis sh
```

### Test Redis connectivity from the API container

```bash
docker compose exec api python -c "
import redis
r = redis.from_url('redis://redis:6379/0')
print(r.ping())
"
```

### Inspect environment variables loaded inside a container

```bash
docker compose exec api env | grep -E 'DATABASE_URL|REDIS_URL|GROQ_API_KEY|SUPABASE'
```

### Check which ports are mapped

```bash
docker compose port api 8000
docker compose port redis 6379
```

### View resource usage

```bash
docker stats --no-stream
```

### Rebuild a single service

```bash
docker compose build api
docker compose up -d api
```

### Restart a single service without rebuilding

```bash
docker compose restart taskiq_worker
```

---

## 6. Cleaning Up

```bash
# Stop all services and remove containers
docker compose down

# Stop and also remove the Redis data volume
docker compose down -v

# Remove all built images for this project
docker compose down --rmi all

# Full cleanup — removes all stopped containers, unused images, and build cache
docker system prune -a
```

> **⚠️ Warning:** `docker compose down -v` deletes the `redis_data` named volume, which stores any cached task results. This is safe for development but be aware of it.

---

## 7. Getting Help

If the troubleshooting steps above don't resolve your issue:

1. **Search existing issues:** [github.com/Team-NoxVeil/InterXAI/issues](https://github.com/Team-NoxVeil/InterXAI/issues)
2. **Open a new issue** with:
   - Your OS and Docker version (`docker --version`, `docker compose version`)
   - The exact error message
   - Output of `docker compose logs` (relevant service)
   - Contents of `backend/.env` (**redact secrets!**)
3. **Label the issue** with `docker` or `bug` for faster triage.
