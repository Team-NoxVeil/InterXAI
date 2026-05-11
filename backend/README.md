# InterXAI — Backend

FastAPI-based backend for the InterXAI interview automation platform. Handles all API logic, AI-driven resume evaluation, background job processing, and authentication.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Configuration](#configuration)
5. [Running the Server](#running-the-server)
6. [Background Jobs (TaskIQ)](#background-jobs-taskiq)
7. [Database Migrations](#database-migrations)
8. [Architecture Deep Dive](#architecture-deep-dive)
9. [API Endpoints](#api-endpoints)
10. [AI Pipeline](#ai-pipeline)
11. [Code Quality](#code-quality)
12. [Docker](#docker)


## Tech Stack

| Technology | Purpose |
|---|---|
| **FastAPI** | Async REST API framework |
| **SQLAlchemy 2.0** | Async ORM |
| **Alembic** | Schema migrations |
| **TaskIQ + Redis** | Async background job queue |
| **LangChain + LiteLLM** | LLM orchestration |
| **Groq** | LLM inference provider |
| **PyPDF2** | Resume PDF text extraction |
| **Supabase** | File storage (resume PDFs) |
| **PyJWT + bcrypt** | Authentication |
| **Pydantic v2** | Request/response validation and settings |
| **uv** | Python package manager |


## Project Structure

```
backend/
├── app/
│   ├── main.py                 # App factory, lifespan, router registration
│   ├── config.py               # Environment-driven settings (pydantic-settings)
│   ├── database.py             # Async SQLAlchemy engine and session factory
│   ├── logger.py               # Structured logging configuration
│   │
│   ├── routers/                # Route handlers (business logic lives here)
│   │   ├── user.py             # /users — signup, login, profile CRUD
│   │   ├── organization.py     # /organizations — org registration and CRUD
│   │   ├── interview.py        # /interviews — create, list, detail
│   │   └── application.py      # /applications — apply with resume, view results
│   │
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── base.py             # BaseTable (id, created_at, updated_at)
│   │   ├── user.py             # User, UserProfile
│   │   ├── organization.py     # Organization
│   │   ├── interview.py        # CustomInterview, CustomQuestion, DsaTopic
│   │   ├── application.py      # Application, InterviewSession
│   │   └── interaction.py      # Interaction, FollowUpQuestion, DsaInteraction,
│   │                           # ResumeConversation, ResumeQuestion
│   │
│   ├── schemas/                # Pydantic request/response models
│   │
│   ├── interfaces/             # Abstract base classes (dependency inversion)
│   │   ├── base_agent.py       # BaseAgent[TRequest, TResponse]
│   │   ├── llm_provider.py     # LLMProviderInterface
│   │   ├── storage_proivder.py # StorageProviderInterface
│   │   ├── authenticator.py    # Auth interface
│   │   ├── hasher.py           # Hasher interface
│   │   ├── encrypter.py        # Encrypter interface
│   │   └── logger.py           # Logger interface
│   │
│   ├── utils/                  # Concrete implementations
│   │   ├── authorization.py    # JWT auth dependencies (get_current_user, etc.)
│   │   ├── supabase.py         # SupabaseStorageProvider
│   │   └── ...                 # BcryptHasher, JwtEncrypter, PDF extractor
│   │
│   ├── ai/                     # LLM agents and prompts
│   │   ├── lite_llm.py         # LiteLLMProvider (wraps langchain_litellm)
│   │   ├── resume_evaluator.py # ResumeEvaluator agent
│   │   ├── prompts.py          # ChatPromptTemplates
│   │   └── schema.py           # Agent request/response Pydantic models
│   │
│   ├── background/
│   │   ├── taskiq/
│   │   │   ├── taskiq.py                  # Broker setup (Redis + SSL)
│   │   │   └── resume_processing_task.py  # Async resume evaluation task
│   │   └── celery/
│   │       └── celery.py                  # Legacy Celery config (deprecated)
│   │
│   └── exceptions/             # Custom exception classes → HTTP status codes
│
├── alembic/                    # Migration scripts
│   └── versions/
├── Dockerfile                  # API server container
├── Dockerfile.taskiq           # TaskIQ worker container
├── pyproject.toml              # Project metadata and dependencies
├── ruff.toml                   # Ruff linter configuration
└── mypy.ini                    # Mypy type checker configuration
```


## Setup & Installation

This project uses [`uv`](https://github.com/astral-sh/uv) for dependency management.

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install all dependencies, including dev tools
uv sync --dev
```


## Configuration

All settings are loaded from a `.env` file via `pydantic-settings`. Create `backend/.env`:

```env
# Application
APP_NAME=InterXAI
DEBUG=false
API_V1_PREFIX=/api/v1

# Database
# Development: leave as default (SQLite)
# Production: use PostgreSQL + asyncpg
DATABASE_URL=sqlite+aiosqlite:///./dev.db
# DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname

# Security
SECRET_KEY=change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30000

# TaskIQ / Redis
REDIS_URL=redis://localhost:6379/0

# LLM (Groq)
LLM_MODEL_NAME=groq/openai/gpt-oss-120b
GROQ_API_KEY=your-groq-api-key

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
SUPABASE_BUCKET_NAME=resumes
```

All variables are defined and validated in `app/config.py`. Access them anywhere via the `settings` singleton:

```python
from app.config import settings

print(settings.DATABASE_URL)
```


## Running the Server

```bash
# Development (hot-reload enabled)
uv run uvicorn app.main:app --reload

# Production
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Interactive API docs are served automatically:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`


## Background Jobs (TaskIQ)

InterXAI uses [TaskIQ](https://taskiq-python.github.io/) with a Redis broker for asynchronous resume processing. The worker runs independently from the API server.

### Starting the Worker

```bash
uv run taskiq worker app.background.taskiq.taskiq:broker
```

### How It Works

When a candidate applies for an interview (`POST /applications/{interview_id}`):

1. The router creates an `Application` record immediately and dispatches a task
2. The HTTP response returns to the client without waiting for evaluation
3. The TaskIQ worker picks up the task and:
   - Decodes the base64-encoded PDF bytes
   - Uploads the PDF to Supabase Storage
   - Extracts plain text using PyPDF2
   - Calls `ResumeEvaluator.evaluate()` via the LLM pipeline
   - Writes `score`, `shortlisting_decision`, and `feedback` back to the `Application` record
   - Deletes the `Application` record on failure and re-raises

### Broker Configuration (`app/background/taskiq/taskiq.py`)

The broker uses `taskiq-redis` and supports optional SSL for production Redis connections. The broker is started and stopped via FastAPI's `lifespan` context manager in `main.py`.


## Database Migrations

Migrations are managed with [Alembic](https://alembic.sqlalchemy.org/).

```bash
# Apply all pending migrations to bring the DB up to date
uv run alembic upgrade head

# Roll back one migration
uv run alembic downgrade -1

# After changing a SQLAlchemy model, auto-generate a new migration
uv run alembic revision --autogenerate -m "add feedback column to applications"

# View migration history
uv run alembic history --verbose
```

> **Note:** Alembic uses a sync connection even for async SQLAlchemy setups. This is configured in `alembic/env.py`.


## Architecture Deep Dive

### Dependency Injection Pattern

Every route uses FastAPI's `Depends()` for auth and database sessions:

```python
@router.get("/{interview_id}")
async def get_interview(
    interview_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InterviewResponse:
    ...
```

Auth guards are composable dependencies:

| Dependency | Purpose |
|---|---|
| `get_current_user()` | Validates JWT, returns authenticated user |
| `verify_ownership()` | Ensures the user owns the requested resource |
| `verify_org_ownership()` | Ensures the org owns the requested resource |
| `is_organization()` | Restricts route to organization accounts only |

### Interface / Implementation Pattern

All major integrations follow the same pattern — abstractions in `app/interfaces/`, concrete implementations in `app/utils/` or `app/ai/`:

```
app/interfaces/llm_provider.py      →  app/ai/lite_llm.py
app/interfaces/storage_provider.py  →  app/utils/supabase.py
app/interfaces/hasher.py            →  app/utils/ (BcryptHasher)
app/interfaces/encrypter.py         →  app/utils/ (JwtEncrypter)
app/interfaces/base_agent.py        →  app/ai/resume_evaluator.py
```

This makes it straightforward to swap providers (e.g., Groq → OpenAI, Supabase → S3) without touching business logic.

### Model Structure

```
BaseTable
  └── id (PK), created_at, updated_at

User
  ├── is_organization: bool   (single table for users and orgs)
  └── UserProfile (1:1)

CustomInterview
  ├── CustomQuestion[] (1:N)
  └── DsaTopic[] (1:N)

Application                   (pivot: User ↔ CustomInterview)
  ├── resume_url: str
  ├── score: float
  ├── shortlisted: bool
  ├── feedback: str
  └── InterviewSession (1:1)
        ├── current_round: Enum(QUESTIONS | DSA | RESUME)
        ├── status: Enum(SCHEDULED | ONGOING | COMPLETED | CANCELLED | CHEATED)
        ├── Interaction[] → FollowUpQuestion[]
        ├── DsaInteraction[]
        └── ResumeConversation[] → ResumeQuestion[]
```

### Exception Handling

Domain-specific exceptions are defined in `app/exceptions/` and registered as handlers in `main.py`. Routers raise typed exceptions; handlers convert them to `JSONResponse` with the appropriate HTTP status code. Never raise `HTTPException` directly in routers.

```
AuthException       → 401 / 403
NotFoundException   → 404
StorageException    → 502
AIError             → 500
```


## API Endpoints

### Users (`/users`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/users/signup` | — | Register a new candidate account |
| `POST` | `/users/login` | — | Authenticate, receive JWT |
| `GET` | `/users/{user_id}` | User | Get user profile |
| `PUT` | `/users/{user_id}` | User | Update profile |
| `DELETE` | `/users/{user_id}` | User | Delete account |

### Organizations (`/organizations`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/organizations/signup` | — | Register a new organization |
| `GET` | `/organizations/{org_id}` | Org | Get organization details |
| `PUT` | `/organizations/{org_id}` | Org | Update organization |
| `DELETE` | `/organizations/{org_id}` | Org | Delete organization |

### Interviews (`/interviews`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/interviews/` | Org | Create a new interview |
| `GET` | `/interviews/` | Any | List (orgs see own, users see open) |
| `GET` | `/interviews/applied` | User | List interviews the user has applied to |
| `GET` | `/interviews/{interview_id}` | Org | Get full interview details |

### Applications (`/applications`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/applications/{interview_id}` | User | Apply with a resume PDF |
| `GET` | `/applications/{interview_id}` | Org | List all applications for an interview |


## AI Pipeline

### ResumeEvaluator

`ResumeEvaluator` extends `BaseAgent[ResumeEvaluatorRequest, ResumeEvaluatorResponse]`:

```python
# Request
class ResumeEvaluatorRequest(BaseModel):
    resume_text: str
    job_title: str
    job_description: str
    experience: str

# Response
class ResumeEvaluatorResponse(BaseModel):
    score: float                        # 0.0 – 100.0
    shortlisting_decision: bool
    feedback: str
    extracted_standardized_resume: dict
```

The agent:
1. Renders a `ChatPromptTemplate` with the request data
2. Calls `LiteLLMProvider.generate()` → Groq API
3. Parses the JSON response with LangChain's `JsonOutputParser`
4. Returns a typed `ResumeEvaluatorResponse`

### LiteLLMProvider

Wraps `langchain_litellm.ChatLiteLLM` and maps provider-specific exceptions to the custom `AIError` hierarchy, keeping the rest of the application decoupled from the LLM provider.


## Code Quality

All checks are run from the `backend/` directory.

```bash
# Run everything at once (ruff fix + format + mypy)
./tools/backend_lint

# Ruff — lint and auto-fix
uv run ruff check --fix .

# Ruff — format
uv run ruff format .

# Mypy — strict type checking
uv run mypy .
```

### Configuration

**`ruff.toml`**
- Line length: `100`
- Enabled rule sets: `E, W, F, I, N, UP, B, C4, SIM, ARG, PTH`
- Excluded: `alembic/versions/`

**`mypy.ini`**
- Strict mode enabled
- `untyped-decorator` disabled for `app/background/celery/` (Celery decorator limitation)


## Docker

### Building Images

```bash
# API server
docker build -f Dockerfile -t interxai-api .

# TaskIQ worker
docker build -f Dockerfile.taskiq -t interxai-worker .
```

### Running via Docker Compose

From the repository root:

```bash
# Start all services (API + TaskIQ worker + Redis)
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f api
docker-compose logs -f taskiq_worker
```

**Services started by Docker Compose:**

| Service | Port | Description |
|---|---|---|
| `api` | `8000` | FastAPI application server |
| `taskiq_worker` | — | Background job worker |
| `redis` | `6379` | TaskIQ broker and result backend |
