/**
 * auth.service.ts
 * All API calls to the backend auth endpoints.
 * Mirrors the backend schemas in app/schemas/user.py
 */

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
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new AuthServiceError(
      response.status,
      data?.detail ?? "Login failed. Please check your credentials.",
    );
  }

  return response.json() as Promise<TokenResponse>;
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
export async function fetchCurrentUser(token: string): Promise<UserResponse> {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new AuthServiceError(
      response.status,
      data?.detail ?? "Could not load your account.",
    );
  }

  return response.json() as Promise<UserResponse>;
}
