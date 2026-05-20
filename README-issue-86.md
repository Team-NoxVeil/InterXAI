# Issue 86 Fix: GET /interviews/{interview_id} after scheduled time

## Problem

`GET /interviews/{interview_id}` could fail for valid interviews after their scheduled times passed because the response path was using a schema tied too closely to create-time validation rules.

## Fix

The solution was kept intentionally simple:

- Added a dedicated read-only interview response schema without the future-date validator.
- Pointed the interview detail endpoint at that read-only schema.
- Left the create schema unchanged so interview creation still validates future dates and score constraints.

## Files Changed

- `backend/app/schemas/interview.py`
- `backend/app/routers/interview.py`

## Behavior After the Fix

- Creating an interview still enforces:
  - `start_time` must be in the future
  - `end_time` must be in the future
  - `submission_deadline` must be in the future
  - `dsa_score + dev_score == 100`
- Reading an interview with `GET /interviews/{interview_id}` now uses a validator-free read schema, so expired or past-scheduled interviews can still be retrieved normally.

## Validation

The touched backend files compile successfully with:

```bash
python -m compileall backend/app/schemas/interview.py backend/app/routers/interview.py
```

## Local Run

The project can be run locally with:

```bash
cd backend
$env:BACKGROUND_WORKER='noop'
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm run dev
```
