/**
 * organization.service.ts
 * API calls for organization endpoints.
 * Mirrors app/schemas/organization.py and app/routers/organization.py
 */

import { apiClient } from "./apiClient";

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
    this.name = "OrgServiceError";
  }
}

// ── Endpoints ────────────────────────────────────────────────────────────────

/** POST /organizations/signup */
export async function signupOrganization(
  payload: OrgSignupRequest,
): Promise<OrgSignupResponse> {
  try {
    const response = await apiClient.post<OrgSignupResponse>(
      "/organizations/signup",
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new OrgServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ?? "Request failed. Please try again.",
    );
  }
}

/**
 * Organization login re-uses the user login endpoint.
 * POST /users/login → returns a JWT that encodes the org account.
 */
export async function loginOrganization(credentials: {
  username: string;
  password: string;
}): Promise<{ token: string }> {
  try {
    const response = await apiClient.post<{ token: string; user: unknown }>(
      "/users/login",
      credentials,
    );
    return { token: response.data.token };
  } catch (error: any) {
    throw new OrgServiceError(
      error.response?.status ?? 500,
      error.response?.data?.detail ??
        "Login failed. Please check your credentials.",
    );
  }
}
