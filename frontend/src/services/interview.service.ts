const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class InterviewServiceError extends Error {
  public readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "InterviewServiceError";
  }
}

export type Round = "questions" | "dsa" | "resume";

export type SessionStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "cheated"
  | "disqualified";

export type QuestionPayload =
  | { type: "custom"; interaction_id: number; question: string }
  | {
      type: "dsa";
      interaction_id: number;
      problem_name: string;
      description: string;
      sample_test_cases: Array<{
        stdin: string;
        expected_stdout: string;
      }> | null;
      time_limit_ms: number;
    }
  | { type: "resume"; question_id: number; question: string };

export interface InterviewStateResponse {
  session_id: number;
  round: Round;
  completed: boolean;
  question: QuestionPayload | null;
}

export interface HeartbeatResponse {
  status: SessionStatus;
}

export interface DsaRunRequest {
  source_code: string;
  language: string;
  stdin?: string;
}

export interface DsaRunResponse {
  stdout: string;
  stderr: string;
  exit_code: number;
}

export interface DsaTestRequest {
  source_code: string;
  language: string;
}

export interface DsaTestResponse {
  case_results: Array<{
    case: number;
    status: "passed" | "failed" | "error";
  }>;
}

export interface DsaSubmitRequest {
  source_code: string;
  language: string;
}

export interface DsaCaseResult {
  case: number;
  status: "passed" | "failed" | "error";
  expected: string;
  actual: string;
}

export interface DsaSubmitResponse {
  case_results: DsaCaseResult[];
  score: number;
  next_state: InterviewStateResponse;
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new InterviewServiceError(
      res.status,
      data?.detail ?? "Request failed.",
    );
  }
  return res.json() as Promise<T>;
}

export async function startInterview(
  interviewId: number,
  token: string,
): Promise<InterviewStateResponse> {
  const res = await fetch(`${BASE_URL}/interviews/${interviewId}/start`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return handle<InterviewStateResponse>(res);
}

export async function sendHeartbeat(
  sessionId: number,
  token: string,
): Promise<HeartbeatResponse> {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}/heartbeat`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return handle<HeartbeatResponse>(res);
}

export async function submitAnswer(
  sessionId: number,
  answer: string,
  token: string,
): Promise<InterviewStateResponse> {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}/answer`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ answer }),
  });
  return handle<InterviewStateResponse>(res);
}

export async function dsaRun(
  sessionId: number,
  payload: DsaRunRequest,
  token: string,
): Promise<DsaRunResponse> {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}/dsa/run`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handle<DsaRunResponse>(res);
}

export async function dsaTest(
  sessionId: number,
  payload: DsaTestRequest,
  token: string,
): Promise<DsaTestResponse> {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}/dsa/test`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handle<DsaTestResponse>(res);
}

export async function dsaSubmit(
  sessionId: number,
  payload: DsaSubmitRequest,
  token: string,
): Promise<DsaSubmitResponse> {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}/dsa/submit`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handle<DsaSubmitResponse>(res);
}
