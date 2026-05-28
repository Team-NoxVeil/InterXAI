import { apiClient } from "./apiClient";

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

export async function startInterview(
  interviewId: number,
): Promise<InterviewStateResponse> {
  try {
    const res = await apiClient.post<InterviewStateResponse>(
      `/interviews/${interviewId}/start`,
    );
    return res.data;
  } catch (error: any) {
    throw new InterviewServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed.",
    );
  }
}

export async function sendHeartbeat(
  sessionId: number,
): Promise<HeartbeatResponse> {
  try {
    const res = await apiClient.post<HeartbeatResponse>(
      `/sessions/${sessionId}/heartbeat`,
    );
    return res.data;
  } catch (error: any) {
    throw new InterviewServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed.",
    );
  }
}

export async function submitAnswer(
  sessionId: number,
  answer: string,
): Promise<InterviewStateResponse> {
  try {
    const res = await apiClient.post<InterviewStateResponse>(
      `/sessions/${sessionId}/answer`,
      { answer },
    );
    return res.data;
  } catch (error: any) {
    throw new InterviewServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed.",
    );
  }
}

export async function dsaRun(
  sessionId: number,
  payload: DsaRunRequest,
): Promise<DsaRunResponse> {
  try {
    const res = await apiClient.post<DsaRunResponse>(
      `/sessions/${sessionId}/dsa/run`,
      payload,
    );
    return res.data;
  } catch (error: any) {
    throw new InterviewServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed.",
    );
  }
}

export async function dsaTest(
  sessionId: number,
  payload: DsaTestRequest,
): Promise<DsaTestResponse> {
  try {
    const res = await apiClient.post<DsaTestResponse>(
      `/sessions/${sessionId}/dsa/test`,
      payload,
    );
    return res.data;
  } catch (error: any) {
    throw new InterviewServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed.",
    );
  }
}

export async function dsaSubmit(
  sessionId: number,
  payload: DsaSubmitRequest,
): Promise<DsaSubmitResponse> {
  try {
    const res = await apiClient.post<DsaSubmitResponse>(
      `/sessions/${sessionId}/dsa/submit`,
      payload,
    );
    return res.data;
  } catch (error: any) {
    throw new InterviewServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed.",
    );
  }
}
