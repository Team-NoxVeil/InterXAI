/**
 * leaderboard.service.ts
 * API calls for org-facing interview management and leaderboard endpoints.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  application_id: number;
  user_id: number;
  username: string;
  email: string;
  score: number;
  shortlisting_decision: boolean;
  feedback: string | null;
  recommendation: string | null;
}

export interface LeaderboardResponse {
  interview_id: number;
  position: string;
  total_candidates: number;
  entries: LeaderboardEntry[];
}

export interface OrgInterview {
  id: number;
  org_id: number;
  description: string;
  position: string;
  experience: string;
  submission_deadline: string;
  start_time: string;
  end_time: string;
}

// ── Error class ───────────────────────────────────────────────────────────────

export class LeaderboardServiceError extends Error {
  public readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "LeaderboardServiceError";
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new LeaderboardServiceError(
      res.status,
      data?.detail ?? "Request failed. Please try again.",
    );
  }
  return res.json() as Promise<T>;
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /interviews/ — returns org's interviews when called with org token */
export async function getOrgInterviews(token: string): Promise<OrgInterview[]> {
  const res = await fetch(`${BASE_URL}/interviews/`, {
    headers: authHeaders(token),
  });
  return handle<OrgInterview[]>(res);
}

/** GET /interviews/{id}/leaderboard */
export async function getLeaderboard(
  interviewId: number,
  token: string,
): Promise<LeaderboardResponse> {
  const res = await fetch(`${BASE_URL}/interviews/${interviewId}/leaderboard`, {
    headers: authHeaders(token),
  });
  return handle<LeaderboardResponse>(res);
}
