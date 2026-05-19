/**
 * user.service.ts
 * API calls for user profile and interview endpoints.
 * Mirrors backend schemas: app/schemas/user.py + app/schemas/interview.py
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ── Helpers ───────────────────────────────────────────────────────────────────
export class UserServiceError extends Error {
  public readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "UserServiceError";
  }
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new UserServiceError(res.status, data?.detail ?? "Request failed.");
  }
  return res.json() as Promise<T>;
}

// ── Types (mirror backend schemas) ───────────────────────────────────────────

export interface UserProfileUpdate {
  leetcode?: string | null;
  github?: string | null;
  linkedin?: string | null;
  photo?: string | null;
  bio?: string | null;
}

export interface UserUpdate {
  username?: string | null;
  email?: string | null;
  profile?: UserProfileUpdate | null;
}

export interface UserProfileResponse {
  leetcode: string | null;
  github: string | null;
  linkedin: string | null;
  photo: string | null;
  bio: string | null;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  profile: UserProfileResponse | null;
}

export interface InterviewBasic {
  id: number;
  org_id: number;
  description: string;
  position: string;
  experience: string;
  submission_deadline: string;
  start_time: string;
  end_time: string;
}

export interface AppliedInterview extends InterviewBasic {
  status: string;
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** PUT /users/:id  — update profile fields */
export async function updateUserProfile(
  userId: number,
  data: UserUpdate,
  token: string,
): Promise<UserResponse> {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse<UserResponse>(res);
}

/** GET /interviews/ — available interviews for this user */
export async function fetchInterviews(
  token: string,
): Promise<InterviewBasic[]> {
  const res = await fetch(`${BASE_URL}/interviews/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<InterviewBasic[]>(res);
}

/** GET /interviews/applied — interviews the user has applied to */
export async function fetchAppliedInterviews(
  token: string,
): Promise<AppliedInterview[]> {
  const res = await fetch(`${BASE_URL}/interviews/applied`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<AppliedInterview[]>(res);
}
