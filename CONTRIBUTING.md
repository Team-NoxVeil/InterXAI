---
# InterXAI Contribution & Development Guide

This document details the configuration steps, system dependency frameworks, and codebase discipline metrics required to participate as a contributor to InterXAI. 

Please follow the project structure, typing standards, and git workflow described below. Please confirm compliance with this outline before editing core elements.

---

## Pre-Flight Technical Checklist

Ensure your engine workspace satisfies these foundational environment boundaries:
* **Python Engine:** Version `3.12+` managed runtime environment.
* **Node.js Environment:** Minimum `20.19+` or `22.12+` Long Term Support runtime targets. *(Note: Execution tiers utilizing Node 18 or lower will crash during local compilation phases due to missing runtime CustomEvent primitives in Vite utilities).*
* **Environment Package Management:** `uv` (Python optimization tooling), alongside native `npm`.
* **Broker Base:** Active local message broker service deployment or an alternate virtual container stack.

---

## Setting Up Local Environments

### Option A: Fully Orchestrated Docker Blueprint 
This profile handles the deployment topology for API processes, execution layers, and message runtimes within an isolated architecture.

1. Run the Docker containers from the project root:
   ```bash
   docker-compose up --build
   

```

2. The runtime boundary automatically maps the API server infrastructure interface to `http://localhost:8000`.

### Option B: Bare-Metal Step-by-Step Configuration

#### 1. Backend Layer Setup (FastAPI Core)

1. Navigate into the backend directory:
```bash
cd backend
```
```

2. Sync the project space and install developer system components natively using `uv`:
   ```bash
   uv sync --dev
```

3. Initialize a structural environment properties file using the provided boilerplate reference:
```bash
cp .env.example .env
```
```

4. Align existing storage states by tracking transactional structural upgrades via Alembic mappings:
   ```bash
   uv run alembic upgrade head

```
5. Launch the live-monitoring server loop:
```bash
uv run uvicorn app.main:app --reload

```
```
#### 2. Background Processing Execution (TaskIQ Worker Tracking)

When auditing tasks interacting with resume files, async data ingestion, or structured agent evaluation routines, spin up an active task cluster worker instance in a secondary execution pane:

```bash
cd backend
uv run taskiq worker app.background.taskiq.taskiq:broker

```

#### 3. Frontend Interface Operations (React Architecture)

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
2. Run clean installations of your local node modules definitions block:
```bash
npm install
```
```
3. Execute the development script loop to coordinate local Vite routing setups:
   ```bash
   npm run dev
```
4. Interact directly with the local development web viewport hosted at `http://localhost:5173`.

---

## Environment Variables Matrix

| Variable Identifier | Operational Scope Requirements |
| --- | --- |
| `GROQ_API_KEY` | Required to route processing tasks to target endpoint models. Provision keys via the Groq Console Engine. |
| `DB_PROVIDER_URL` / `DB_PROVIDER_KEY` | Directs pipeline object assets to cloud structures. Accessible inside your preferred database or authentication provider's project settings. |
| `STORAGE_BUCKET_NAME` | Must align exactly to an initialized storage object vault named `resumes` utilizing standard public resolution settings on your chosen storage provider. |
| `DATABASE_URL` | Defaults to local development mapping structures customized for your preferred backend relational database engine. |

---

## Workspace Git Branch Isolation Rules

Do not publish modification tracks straight to master branches. Structure development pathways using standardized prefix schemas to organize tracking profiles across asynchronous developer clusters:

* **`feat/`** : Introducing structural software enhancements (e.g., `feat/opencv-proctoring-pipeline`)
* **`fix/`** : Code correction operations (e.g., `fix/taskiq-payload-serialization`)
* **`docs/`** : Isolating tracking revisions to content configurations (e.g., `docs/centralize-setup-guide`)
* **`refactor/`** : Structural refinements that do not adjust interface outputs.

*Execution Sample:* `git checkout -b feat/integrate-groq-inference`

---

## Commit Message Discipline (Conventional Commits)

This repository enforces explicit semantic commit rules. Messages must explicitly layout contextual changes utilizing a standard architectural scope syntax to avoid polluted project logs:

```
<type>(<scope>): <short behavioral description summary>

```

### Approved Context Types:

* **`feat`**: Implementation of structural user code behaviors.
* **`fix`**: Resolution of targeted exceptions or runtime breakages.
* **`docs`**: Content updates inside documentation layout parameters.
* **`style`**: Aesthetic adjustments, structural spacing improvements, linting layout corrections.
* **`refactor`**: Functional codebase improvements lacking programmatic output deviations.
* **`chore`**: Maintenance workflows, external module changes, dependency alignments.

### Correct Technical Tracking Examples:

* `feat(ai): patch LiteLLM router wrappers to leverage Groq inference nodes`
* `fix(frontend): adjust Vite script boundaries to clean global CustomEvent execution blocks`
* `docs(api): document multi-round application data structures and validation schemas`

---

## Code Quality Verification Routines

The target framework utilizes strict schema, linting, and formatting protocols. Before pushing file modifications upstream, test your files locally to prevent structural CI/CD build breaks.

From your local root workspace layer, activate the built-in linting shell utility:

```bash
./tools/backend_lint

```

This verification file coordinates a unified test block leveraging **Ruff** for structural logic parsing and code layout formatting alongside **Mypy** for strict application type testing. Ensure code updates adhere directly to the configured maximum **100-character line rule limit**.

---

## Ethical Use of AI

InterXAI values authentic, high-quality human contributions. While using AI-assisted tooling (like code completions) for productivity is acceptable, automated AI-generated pull requests, boilerplate "AI slop," and unverified LLM code dumps are strictly prohibited. All submissions must be logically sound, rigorously tested, and directly address the stated issue. Pull requests violating this policy will be closed immediately without review.

---

## Environment Troubleshooting Matrix

### 1. Vite Throwing `ReferenceError: CustomEvent is not defined`

* **Root Structural Cause:** The environment thread tracking your shell has bound execution processes to legacy Node.js configuration engines (such as v18 or below).
* **Workaround Path:** Verify path settings via `node -v` to ensure your engine aligns with Node v20/v22 targets. If terminal sessions capture stale path parameters, cycle your development terminal windows entirely or isolate processes using explicit runtime execution flags:
```bash
npx vite
# Alternatively, address file trees explicitly
node node_modules/vite/bin/vite.js


```



```

### 2. Missing Database Table Relational Errors on App Bootstrap

* **Root Structural Cause:** The operational local database schema structure is out of alignment with newer data modeling objects declared in the backend routers.
* **Workaround Path:** Execute database component alignments inside the backend folder context:
   ```bash
   uv run alembic upgrade head
   

```

### 3. Upstream Platform & Dependency Engine Errors

For complex system installation setups, environment caching bugs, or infrastructure permission anomalies, please consult the respective official documentation frameworks:

* **Docker/Containers:** For advanced daemon configurations or containerization bugs, review the official troubleshooting guide at https://docs.docker.com/engine/security/rootless/troubleshoot/.
* **Python/UV Setup:** For environment management or package resolution queries, check the [Official UV Integration Reference](https://docs.astral.sh/uv/).
* **Node.js/NPM Runtime:** For syntax engine features or global dependency errors, refer to the [Official Node.js Documentation Portal](https://nodejs.org/en/docs/).

---

## Pull Request Workflow

1. Fork the repository.
2. Create a feature branch using the approved naming conventions.
3. Make and test your changes locally.
4. Commit changes following Conventional Commit standards.
5. Push your branch to your forked repository.
6. Open a Pull Request against the `main` branch.
7. Ensure all CI checks pass before requesting review.

```

