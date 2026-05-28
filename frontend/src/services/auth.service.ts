/**
 * auth.service.ts
 * All API calls to the backend auth endpoints.
 * Mirrors the backend schemas in app/schemas/user.py
 */

import axios, { AxiosError } from "axios";
import { apiClient } from "./apiClient";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

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
    const response = await apiClient.post<TokenResponse>(
      "/users/login",
      credentials,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    throw new AuthServiceError(
      axiosError.response?.status ?? 500,
      axiosError.response?.data?.detail ??
        "Login failed. Please check your credentials.",
    );
  }
}

// ── Google OIDC ───────────────────────────────────────────────────────────────

/** Backend endpoint that starts the Google OIDC redirect dance. */
export const GOOGLE_OAUTH_URL = `${BASE_URL}/users/login/google`;

/**
 * Begins Google sign-in by navigating the whole browser to the backend, which
 * redirects on to Google. On success the backend sends the browser back to the
 * SPA at `/#oidc_token=<jwt>` (see App.tsx for the return handler).
 */
export function startGoogleOAuth(): void {
  window.location.href = GOOGLE_OAUTH_URL;
}

/** GET /users/me — resolve the authenticated user from a bearer token. */
export async function fetchCurrentUser(): Promise<UserResponse> {
  try {
    const response = await apiClient.get<UserResponse>("/users/me");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    throw new AuthServiceError(
      axiosError.response?.status ?? 500,
      axiosError.response?.data?.detail ?? "Could not load your account.",
    );
  }
}
