<div align="center">

<img src="frontend/public/favicon.svg" alt="InterXAI Logo" width="80" height="80" />

# InterXAI

**AI-Powered Interview Automation Platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#features) · [Architecture](#architecture) · [Getting Started](#getting-started) · [API Reference](#api-reference) · [Contributing](#contributing)

</div>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)


## Overview

InterXAI is an AI-powered interview automation platform designed to make technical hiring smarter, faster, and more scalable. It simulates real interview experiences by dynamically generating follow-up questions based on candidate responses, evaluating answers in real time using large language models, and maintaining a natural conversational flow throughout the entire interview process.

Organizations create fully customized interviews with domain-specific questions and DSA challenges. Candidates apply by submitting their resumes, which are automatically evaluated and scored by an LLM agent against the job requirements - all without manual intervention. To ensure interview integrity, the platform integrates proctoring features including tab-switch detection, page-refresh monitoring, and OpenCV-based malpractice detection.


## Features

### For Organizations
- **Custom Interview Builder** - Create structured interviews with tailored questions, DSA topics, and evaluation criteria
- **Automated Resume Screening** - LLM-powered analysis that scores and shortlists candidates automatically
- **AI-Driven Evaluations** - Real-time answer evaluation with structured, unbiased scoring
- **Candidate Dashboard** - Track all applications, review scores, and access AI-generated feedback reports

### For Candidates
- **Seamless Application Flow** - Upload your resume and let the AI evaluate your fit for the role
- **Conversational Interviews** - Experience dynamic, follow-up-rich interviews that adapt to your responses
- **Instant Feedback** - Receive structured feedback on your performance after each session
- **Multi-Round Sessions** - Navigate through Q&A, DSA, and resume-based rounds in a single interview

### Platform Intelligence
- **Dynamic Question Generation** - LLMs generate context-aware follow-up questions based on candidate answers
- **Resume Intelligence** - Extracts, standardizes, and evaluates resume content against job requirements
- **Interview Proctoring** - Tab-switch detection, page-refresh monitoring, and OpenCV-based malpractice detection ensure integrity
- **Event-Driven Processing** - Asynchronous background jobs via TaskIQ + Redis ensure interviews scale without bottlenecks


## Tech Stack

| Layer | Technology |
|---|---|
| **Backend API** | FastAPI, Python 3.12+ |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS 4 |
| **Database** | PostgreSQL via Neon (production) / SQLite (development) |
| **ORM & Migrations** | SQLAlchemy 2.0 (async), Alembic |
| **Background Jobs** | TaskIQ + Redis |
| **AI / LLM** | LangChain, LiteLLM, Groq |
| **File Storage** | Supabase Storage |
| **Auth** | JWT (PyJWT), bcrypt |
| **State Management** | Zustand, React Query |
| **Package Manager** | `uv` (backend), `npm` (frontend) |
| **Containerization** | Docker, Docker Compose |


## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client (React)                         │
│          React Query · Zustand · React Hook Form · Zod          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST / JSON
┌───────────────────────────▼─────────────────────────────────────┐
│                       FastAPI Backend                           │
│   /users  /organizations  /interviews  /applications  /health   │
│                                                                 │
│   ┌────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│   │  Auth (JWT +   │  │  Routers /       │  │  Exception     │  │
│   │  bcrypt)       │  │  Business Logic  │  │  Handlers      │  │
│   └────────────────┘  └────────┬─────────┘  └────────────────┘  │
└────────────────────────────────┼────────────────────────────────┘
                                 │
               ┌─────────────────┼──────────────────┐
               │                 │                  │
    ┌──────────▼───────┐ ┌───────▼──────────┐ ┌────▼────────────┐
    │   PostgreSQL /   │ │  TaskIQ + Redis  │ │ Supabase Storage│
    │   SQLite         │ │  Worker          │ │ (Resume PDFs)   │
    │ (SQLAlchemy ORM) │ └───────┬──────────┘ └─────────────────┘
    └──────────────────┘         │
                        ┌────────▼────────┐
                        │  LLM Pipeline   │
                        │  LiteLLM/Groq   │
                        │  LangChain      │
                        │  ResumeEvaluator│
                        └─────────────────┘
```

### Request Lifecycle

1. The client sends a request with a JWT `Authorization` header
2. FastAPI validates the token via `get_current_user()` dependency injection
3. Router functions execute business logic using async SQLAlchemy sessions
4. For resume applications, a TaskIQ task is dispatched and the HTTP response returns immediately (202)
5. The background worker uploads the PDF to Supabase, extracts text, calls the LLM evaluator, and writes results back to the database

### Resume Processing Pipeline

```
POST /applications/{interview_id}
        │
        ├── Create Application record (status: pending)
        └── Return 202 to client immediately

TaskIQ Worker (async):
        ├── Decode base64 PDF
        ├── Upload PDF → Supabase Storage
        ├── Extract text (PyPDF2)
        ├── ResumeEvaluator.evaluate()
        │       ├── Build ChatPromptTemplate
        │       ├── Call LiteLLM/Groq
        │       └── Parse structured JSON response
        │             score · shortlisting_decision · feedback
        └── Update Application record with evaluation results
              (Delete Application on failure)
```


## Project Structure

```
InterXAI-re/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── ai/                 # LLM agents and prompt templates
│   │   ├── background/
│   │   │   ├── taskiq/         # TaskIQ broker & resume task
│   │   │   └── celery/         # Legacy (deprecated)
│   │   ├── exceptions/         # Custom exception hierarchy
│   │   ├── interfaces/         # Abstract base classes
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── routers/            # API route handlers
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── utils/              # Concrete implementations
│   │   ├── config.py           # Pydantic settings (env-driven)
│   │   ├── database.py         # Async DB session factory
│   │   └── main.py             # App factory, lifespan, middleware
│   ├── alembic/                # Database migrations
│   ├── Dockerfile              # API server image
│   ├── Dockerfile.taskiq       # Worker image
│   └── pyproject.toml
├── frontend/                   # React + TypeScript SPA
│   ├── src/
│   │   ├── app/                # App routing and layout shells
│   │   ├── components/         # Shared, reusable UI components
│   │   ├── features/           # Feature-scoped modules
│   │   └── services/           # Axios-based API client layer
│   └── package.json
├── docker-compose.yml          # Multi-service orchestration
├── LICENSE
└── tools/
    └── backend_lint            # One-shot ruff + mypy quality check
```


## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- Redis (or run everything via Docker)
- [`uv`](https://github.com/astral-sh/uv) - fast Python package manager

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```bash
cp backend/.env.example backend/.env
```

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite+aiosqlite:///./dev.db` | PostgreSQL URL for production |
| `REDIS_URL` | `redis://localhost:6379/0` | TaskIQ broker + result backend |
| `SECRET_KEY` | `secret` | JWT signing key - **change in production** |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30000` | Token lifetime |
| `GROQ_API_KEY` | - | Required for LLM inference |
| `SUPABASE_URL` | - | Supabase project URL |
| `SUPABASE_KEY` | - | Supabase service role key |
| `SUPABASE_BUCKET_NAME` | `resumes` | Storage bucket for resume PDFs |
| `LLM_MODEL_NAME` | `groq/openai/gpt-oss-120b` | LiteLLM model string |

### Option A - Docker (Recommended)

The Docker Compose file starts the API server, TaskIQ worker, and Redis in one command:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:8000`.

### Option B - Local Development

**1. Backend:**

```bash
cd backend

# Install all dependencies, including dev tools
uv sync --dev

# Apply database migrations
uv run alembic upgrade head

# Start the API server (with hot-reload)
uv run uvicorn app.main:app --reload
```

**2. TaskIQ Worker** (in a separate terminal):

```bash
cd backend
uv run taskiq worker app.background.taskiq.taskiq:broker
```

**3. Frontend:**

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs at `http://localhost:5173`.


## API Reference

FastAPI auto-generates interactive documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | - | Health check |
| `POST` | `/users/signup` | - | Register a candidate account |
| `POST` | `/users/login` | - | Authenticate and receive JWT |
| `GET` | `/users/{user_id}` | User | Get user profile |
| `PUT` | `/users/{user_id}` | User | Update user profile |
| `DELETE` | `/users/{user_id}` | User | Delete user account |
| `POST` | `/organizations/signup` | - | Register an organization |
| `GET` | `/organizations/{org_id}` | Org | Get organization details |
| `PUT` | `/organizations/{org_id}` | Org | Update organization |
| `POST` | `/interviews/` | Org | Create a new interview |
| `GET` | `/interviews/` | Any | List interviews |
| `GET` | `/interviews/applied` | User | Get applied interviews |
| `GET` | `/interviews/{interview_id}` | Org | Get full interview details |
| `POST` | `/applications/{interview_id}` | User | Apply with resume (PDF) |
| `GET` | `/applications/{interview_id}` | Org | Get all applications |


## Data Models

```
User ────────────────────────── Organization
  │                                  │
  │ applies to                       │ creates
  ▼                                  ▼
Application ◄──────────── CustomInterview
  │                          │
  │ has session              ├── CustomQuestion[]
  ▼                          └── DsaTopic[]
InterviewSession
  │
  ├── Interaction[]          (Q&A rounds)
  │     └── FollowUpQuestion[]
  ├── DsaInteraction[]       (coding rounds)
  └── ResumeConversation[]   (resume rounds)
        └── ResumeQuestion[]
```

**Interview Session States:** `SCHEDULED` → `ONGOING` → `COMPLETED` | `CANCELLED` | `CHEATED`

**Round Types:** `QUESTIONS` · `DSA` · `RESUME`


## Development

### Running Code Quality Checks

```bash
cd backend

# Run all checks at once (ruff fix + format + mypy)
./tools/backend_lint

# Run individual tools
uv run ruff check --fix .
uv run ruff format .
uv run mypy .
```

### Database Migrations

```bash
cd backend

# Apply all pending migrations
uv run alembic upgrade head

# Auto-generate a new migration after model changes
uv run alembic revision --autogenerate -m "add column to applications"
```


## Contributing

Contributions are welcome. Please follow these steps:

1. **Fork** the repository and clone your fork
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Make** your changes and ensure all quality checks pass: `./tools/backend_lint`
4. **Commit** with a descriptive message following [Conventional Commits](https://www.conventionalcommits.org/)
5. **Push** to your fork and **open a Pull Request**

### Code Guidelines

- Business logic lives inline in routers - no separate service layer yet
- New abstractions go in `app/interfaces/`, implementations in `app/utils/`
- All environment variables must be declared in `app/config.py` via `pydantic-settings`
- Type annotations are mandatory - `mypy --strict` must pass without errors
- Line length: 100 characters (enforced by Ruff)


## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.


<div align="center">
  Built with FastAPI, React, and LangChain
</div>