<div align="center">

<img src="frontend/public/favicon.svg" alt="InterXAI Logo" width="80" height="80" />

# InterXAI

**AI-Powered Interview Automation Platform**

[![FastAPI](https://img.shields.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![License](https://img.shields.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

InterXAI is an production-grade, AI-powered interview automation platform designed to streamline technical hiring. It dynamically generates contextual follow-up questions based on candidate audio/text responses, evaluates performance using LLM inference pipelines, and integrates real-time automated proctoring mechanisms to ensure interview integrity.

---

## 📌 Table of Contents
* [Overview](#overview)
* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [System Architecture](#system-architecture)
* [Project Structure](#project-structure)
* [API Endpoints Summary](#api-endpoints-summary)
* [Data Models](#data-models)
* [Getting Started & Contributing](#getting-started--contributing)
* [License](#license)

---

## 🔍 Overview

InterXAI simulates end-to-end technical interview modules without manual HR bottlenecks. Organizations can provision customized, multi-round interview frameworks that include resume evaluation, general technical Q&A, and live Data Structures & Algorithms (DSA) execution panels. 

Candidates are verified automatically via asynchronous LLM-driven resume analysis matching job descriptions. During live interview loops, the interface tracks client integrity metrics—including tab switching, force refreshes, and computer vision-based anomaly tracking via OpenCV—to enforce high-integrity remote evaluations.

---

## 🚀 Key Features

### For Organizations
* **Custom Interview Builder:** Provision targeted multi-round assessments containing domain-focused question banks and algorithmic validation benchmarks.
* **Automated Resume Screening:** Background LLM parser scores and flags applicant fits against explicit role heuristics before granting interview access.
* **Structured Evaluation Pipeline:** Standardized JSON performance feedback scoring metrics across behavioral, technical, and analytical matrices.

### For Candidates
* **Dynamic Conversational Flow:** Conversational LLM agents inject adaptive follow-up logic inline based on response boundaries.
* **Multi-Round Execution Engine:** Navigate structured loops consisting of resume breakdown, targeted tech stacks, and live algorithmic tracking.
* **Instant Assessment Feedback:** Transparent access to comprehensive, AI-generated technical feedback scores upon session closeout.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Framework** | FastAPI, Python 3.12+ |
| **Frontend Architecture** | React 19, TypeScript, Vite, TailwindCSS 4 |
| **Persistence Layer** | PostgreSQL (Neon Cloud Cluster) / SQLite (Local DB Development) |
| **ORM & Migrations** | Async SQLAlchemy 2.0, Alembic |
| **Asynchronous Core** | TaskIQ, Redis Broker |
| **Orchestration Layer** | LangChain, LiteLLM Engine, Groq Inference Infrastructure |
| **Object Storage** | Supabase Cloud Storage (Resume Blobs) |
| **Authentication System** | State-driven JWT (PyJWT Architecture), bcrypt hashing |
| **State Engineering** | Zustand, React Query (TanStack) |
| **Package Management** | `uv` (Python Application Core), `npm` (Frontend Shell Architecture) |

---

## 🏗️ System Architecture

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


### Async Resume Processing Flow
1. Client pushes multipart resume payloads via `POST /applications/{interview_id}`.
2. The FastAPI edge tier commits a transactional tracker (`status: pending`) and offloads execution to the TaskIQ broker, returning a fast `202 Accepted` network frame.
3. The background task worker decodes the source file, checkpoints the binary signature to Supabase Storage buckets, processes target structures via `PyPDF2`, pipelines context tokens to the `ResumeEvaluator`, and maps the typed execution parameters into the main persistence schema.

---

## 📂 Project Structure

InterXAI-re/
├── backend/                    # FastAPI Core Infrastructure
│   ├── app/
│   │   ├── ai/                 # Agent logic & engineering pipelines
│   │   ├── background/         # Async messaging orchestration (TaskIQ)
│   │   ├── models/             # Declarative SQLAlchemy Schemas
│   │   ├── routers/            # High-performance API routing endpoints
│   │   ├── schemas/            # Validation boundaries via Pydantic V2
│   │   └── config.py           # Explicit Environment Configuration Core
│   ├── alembic/                # Schema Migration Scripts
│   └── pyproject.toml          # Monolithic Python Environment Configuration
├── frontend/                   # React Single-Page Application Client
│   ├── src/
│   │   ├── components/         # Atomic Global UI primitives
│   │   ├── features/           # Feature-sliced component contexts
│   │   └── services/           # Network Clients (Axios Layer)
│   └── package.json
├── tools/
│   └── backend_lint            # Integrated Ruff / Mypy enforcement tooling
└── docker-compose.yml          # Containerized Environment Manifest


---

## 🔌 API Endpoints Summary

Comprehensive documentation layout is served natively through the API instance at `/docs` (Swagger specification) or `/redoc`.

| Method | Route Path | Authorization Target | Target Context Handler |
| :--- | :--- | :--- | :--- |
| **GET** | `/health` | Unauthenticated | Service uptime checking pulse |
| **POST** | `/users/signup` | Unauthenticated | Candidate enrollment pipeline |
| **POST** | `/users/login` | Unauthenticated | Token authentication issuance exchange |
| **GET** | `/interviews/` | Public Scope | Query current interview configurations |
| **POST** | `/interviews/` | Organization Admin | Construct structural interview frames |
| **POST** | `/applications/{interview_id}` | Authenticated User | Append resume file execution token |

---

## 📊 Data Models

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
├── Interaction[]          (General Q&A tracks)
├── DsaInteraction[]       (Algorithmic tracks)
└── ResumeConversation[]   (Profile-specific context tracks)


---

## 🏁 Getting Started & Contributing

To get your local workspace running, spin up background services, configure third-party environment infrastructure, or conform to testing and code style configurations, please jump directly into the comprehensive instruction guide:

👉 **Review the complete [Onboarding & Contribution Guidelines (CONTRIBUTING.md)](./CONTRIBUTING.md)**

---

## 📄 License

Distributed under the MIT Open Source License. Review the enclosed [LICENSE](LICENSE) definition for structural terms.