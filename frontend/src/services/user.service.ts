/**
 * user.service.ts
 * API calls for user profile and interview endpoints.
 * Mirrors backend schemas: app/schemas/user.py + app/schemas/interview.py
 */

import { apiClient } from "./apiClient";

// ── Helpers ───────────────────────────────────────────────────────────────────
export class UserServiceError extends Error {
  public readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "UserServiceError";
  }
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
): Promise<UserResponse> {
  try {
    const res = await apiClient.put<UserResponse>(`/users/${userId}`, data);
    return res.data;
  } catch (error: any) {
    throw new UserServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed.",
    );
  }
}

/** GET /interviews/ — available interviews for this user */
export async function fetchInterviews(): Promise<InterviewBasic[]> {
  try {
    const res = await apiClient.get<InterviewBasic[]>("/interviews/");
    return res.data;
  } catch (error: any) {
    throw new UserServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed.",
    );
  }
}

/** GET /interviews/applied — interviews the user has applied to */
export async function fetchAppliedInterviews(): Promise<AppliedInterview[]> {
  try {
    const res = await apiClient.get<AppliedInterview[]>("/interviews/applied");
    return res.data;
  } catch (error: any) {
    throw new UserServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed.",
    );
  }
}
