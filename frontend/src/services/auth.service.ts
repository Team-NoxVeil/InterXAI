/**
 * auth.service.ts
 * All API calls to the backend auth endpoints.
 * Mirrors the backend schemas in app/schemas/user.py
 */

import { apiClient } from "./apiClient";

// ── Request / Response types (mirrors backend schemas) ──────────────────────

export interface LoginRequest {
  username: string;
  password: string;
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

export interface TokenResponse {
  token: string;
  user: UserResponse;
}

// ── Service ──────────────────────────────────────────────────────────────────

export class AuthServiceError extends Error {
  public readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthServiceError";
  }
}

export async function loginUser(
  credentials: LoginRequest,
): Promise<TokenResponse> {
  try {
    const response = await apiClient.post<TokenResponse>("/users/login", credentials);
    return response.data;
  } catch (error: any) {
    throw new AuthServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Login failed. Please check your credentials.",
    );
  }
}
