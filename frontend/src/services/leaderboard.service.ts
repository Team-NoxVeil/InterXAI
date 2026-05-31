/**
 * leaderboard.service.ts
 * Admin-side API for managing interviews, applications, and viewing the
 * leaderboard. Mirrors:
 *   - app/routers/interview.py     (GET / POST /interviews/, GET /interviews/{id})
 *   - app/routers/application.py   (GET /applications/{interview_id})
 *   - app/routers/leaderboard.py   (GET /leaderboard/{interview_id})
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ── Interview list / detail / create types ──────────────────────────────────

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

export interface CustomQuestion {
  id: number;
  interview_id: number;
  question: string;
  expected_answer: string;
}

export interface DsaTopic {
  id: number;
  interview_id: number;
  topic: string;
  difficulty: string;
}

export interface OrgInterviewDetail extends OrgInterview {
  duration: number;
  dsa_score: number;
  dev_score: number;
  resume_shortlist_score: number;
  ask_questions_on_resume: boolean;
  questions: CustomQuestion[];
  dsa_topics: DsaTopic[];
}

export interface CreateInterviewPayload {
  description: string;
  position: string;
  experience: string;
  submission_deadline: string;
  start_time: string;
  end_time: string;
  duration: number;
  dsa_score: number;
  dev_score: number;
  resume_shortlist_score: number;
  ask_questions_on_resume: boolean;
  questions: { question: string; expected_answer: string }[];
  dsa_topics: { topic: string; difficulty: string }[];
}

// ── Application list ────────────────────────────────────────────────────────

export interface ApplicationResponse {
  id: number;
  user_id: number;
  interview_id: number;
  resume: string | null;
  extracted_resume: string | null;
  status: string;
  score: number;
  shortlisting_decision: boolean;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

// ── Leaderboard (mirrors app/schemas/leaderboard.py) ────────────────────────

export interface FollowUpTurn {
  id: number;
  question: string;
  answer: string | null;
}

export interface QuestionInteractionResult {
  id: number;
  question: string | null;
  expected_answer: string | null;
  score: number | null;
  feedback: string | null;
  follow_ups: FollowUpTurn[];
}

export interface DsaInteractionResult {
  id: number;
  problem_name: string | null;
  description: string | null;
  difficulty: string | null;
  topic: string | null;
  language: string | null;
  code: string | null;
  score: number | null;
}

export interface ResumeQuestionResult {
  id: number;
  question: string;
  expected_answer: string | null;
  answer: string | null;
}

export interface ResumeConversationResult {
  id: number;
  score: number;
  feedback: string | null;
  questions: ResumeQuestionResult[];
}

export interface SessionResult {
  id: number;
  status: string;
  score: number | null;
  feedback: string | null;
  recommendation: string | null;
  strengths: string | null;
  start_time: string;
  end_time: string | null;
  questions_round: QuestionInteractionResult[];
  dsa_round: DsaInteractionResult[];
  resume_round: ResumeConversationResult[];
}

export interface LeaderboardEntry {
  rank: number;
  application_id: number;
  user_id: number;
  username: string;
  email: string;
  status: string;
  resume_score: number;
  shortlisting_decision: boolean;
  application_feedback: string | null;
  interview_score: number | null;
  sessions: SessionResult[];
}

export interface LeaderboardResponse {
  interview_id: number;
  position: string;
  total_candidates: number;
  entries: LeaderboardEntry[];
}

// ── Error class + helpers ───────────────────────────────────────────────────

export class LeaderboardServiceError extends Error {
  public readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "LeaderboardServiceError";
  }
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
    throw new LeaderboardServiceError(
      res.status,
      data?.detail ?? "Request failed. Please try again.",
    );
  }
  return res.json() as Promise<T>;
}

// ── Interview endpoints ─────────────────────────────────────────────────────

/** GET /interviews/ — returns this org's interviews when called with an org token. */
export async function getOrgInterviews(token: string): Promise<OrgInterview[]> {
  const res = await fetch(`${BASE_URL}/interviews/`, {
    headers: authHeaders(token),
  });
  return handle<OrgInterview[]>(res);
}

/** GET /interviews/{id} — full details including questions + dsa_topics. */
export async function getOrgInterview(
  interviewId: number,
  token: string,
): Promise<OrgInterviewDetail> {
  const res = await fetch(`${BASE_URL}/interviews/${interviewId}`, {
    headers: authHeaders(token),
  });
  return handle<OrgInterviewDetail>(res);
}

/** POST /interviews/ — create a new interview. */
export async function createOrgInterview(
  payload: CreateInterviewPayload,
  token: string,
): Promise<OrgInterviewDetail> {
  const res = await fetch(`${BASE_URL}/interviews/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handle<OrgInterviewDetail>(res);
}

/** POST /interviews/seed-test — create a pre-filled test interview. */
export async function seedTestInterview(
  token: string,
): Promise<OrgInterviewDetail> {
  const res = await fetch(`${BASE_URL}/interviews/seed-test`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return handle<OrgInterviewDetail>(res);
}

// ── Applications ────────────────────────────────────────────────────────────

/** GET /applications/{interview_id} */
export async function getInterviewApplications(
  interviewId: number,
  token: string,
): Promise<ApplicationResponse[]> {
  const res = await fetch(`${BASE_URL}/applications/${interviewId}`, {
    headers: authHeaders(token),
  });
  return handle<ApplicationResponse[]>(res);
}

/** PATCH /applications/{application_id}/shortlist — toggle shortlisting decision. */
export async function toggleShortlist(
  applicationId: number,
  token: string,
): Promise<ApplicationResponse> {
  const res = await fetch(
    `${BASE_URL}/applications/${applicationId}/shortlist`,
    { method: "PATCH", headers: authHeaders(token) },
  );
  return handle<ApplicationResponse>(res);
}


// ── Leaderboard ─────────────────────────────────────────────────────────────

/** GET /leaderboard/{interview_id} */
export async function getLeaderboard(
  interviewId: number,
  token: string,
): Promise<LeaderboardResponse> {
  const res = await fetch(`${BASE_URL}/leaderboard/${interviewId}`, {
    headers: authHeaders(token),
  });
  return handle<LeaderboardResponse>(res);
}
