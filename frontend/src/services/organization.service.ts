/**
 * organization.service.ts
 * API calls for organization endpoints.
 * Mirrors app/schemas/organization.py and app/routers/organization.py
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// ── Types (mirrors backend schemas) ─────────────────────────────────────────

export interface OrgSignupRequest {
  username: string;
  password: string;
  email: string;
}

export interface OrganizationResponse {
  id: number;
  account_id: number;
  address: string | null;
  email: string | null;
  url: string | null;
  linkedin: string | null;
  photo: string | null;
  description: string | null;
}

export interface OrgSignupResponse {
  organization: OrganizationResponse;
  access_token: string;
}

// ── Shared error class ───────────────────────────────────────────────────────

export class OrgServiceError extends Error {
  public readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'OrgServiceError';
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new OrgServiceError(
      response.status,
      data?.detail ?? 'Request failed. Please try again.',
    );
  }
  return response.json() as Promise<T>;
}

// ── Endpoints ────────────────────────────────────────────────────────────────

/** POST /organizations/signup */
export async function signupOrganization(
  payload: OrgSignupRequest,
): Promise<OrgSignupResponse> {
  const response = await fetch(`${BASE_URL}/organizations/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<OrgSignupResponse>(response);
}

/**
 * Organization login re-uses the user login endpoint.
 * POST /users/login → returns a JWT that encodes the org account.
 */
export async function loginOrganization(credentials: {
  username: string;
  password: string;
}): Promise<{ token: string }> {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await handleResponse<{ token: string; user: unknown }>(response);
  return { token: data.token };
}
