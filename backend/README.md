# InterXAI Backend

FastAPI-based backend for the InterXAI interview automation system.

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Code Quality Tools](#2-code-quality-tools)

---

## 1. Project Setup

This project uses [`uv`](https://github.com/astral-sh/uv) as the package manager.

```bash
# Install dependencies
uv sync --dev

# Run the server
uv run uvicorn app.main:app --reload
```

---

## 2. Code Quality Tools

### 2.1 Ruff

**Repository:** [astral-sh/ruff](https://github.com/astral-sh/ruff)

An extremely fast Python linter and code formatter.

```bash
# Lint check
uv run ruff check .

# Auto-fix issues
uv run ruff check --fix

# Format code
uv run ruff format .

# Check formatting (without changes)
uv run ruff format --check .
```

### 2.2 mypy

**Repository:** [python/mypy](https://github.com/python/mypy)

Static type checker for Python.

```bash
# Run type checking
uv run mypy .

# Check specific file
uv run mypy path/to/file.py
```

### 2.3 Running All Checks

Use the provided script from the project root:

```bash
# Run all checks (ruff + mypy)
./tools/backend_lint.sh

# Run only ruff
./tools/backend_lint.sh --only=ruff

# Run only mypy
./tools/backend_lint.sh --only=mypy
```
