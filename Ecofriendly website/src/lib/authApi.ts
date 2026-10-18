/**
 * Authentication API client for the Earthform admin.
 * Communicates with the Express backend using HTTP-only cookies (credentials: 'include').
 *
 * SECURITY:
 * - Auth token is stored in an HTTP-only cookie set by the backend.
 * - This client never reads or stores the token in JavaScript.
 * - credentials: 'include' ensures the cookie is sent automatically with every request.
 */

import { getApiBaseUrl } from "./apiConfig";

const BASE_URL = getApiBaseUrl();

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Login with email and password.
 * On success, the backend sets the HTTP-only auth_token cookie.
 * Returns the authenticated admin user object.
 * Throws with backend error message on failure.
 */
export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Required: receives and stores the HTTP-only cookie
    body: JSON.stringify({ email, password }),
  });

  const json: AuthResponse<AdminUser> = await res.json().catch(() => ({
    success: false,
    error: "Unexpected server response.",
  }));

  if (!res.ok || !json.success) {
    throw new Error(json.error || json.message || `Login failed (HTTP ${res.status})`);
  }

  return json.data!;
}

/**
 * Logout — tells the backend to clear the auth_token cookie.
 */
export async function logout(): Promise<void> {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  // Intentionally swallow errors — logout should never hard-fail the UI
}

/**
 * Get the currently authenticated admin user.
 * Returns null if not authenticated (401).
 * Throws on network or unexpected server errors.
 */
export async function getMe(): Promise<AdminUser | null> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    // Network error — backend unreachable
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  if (res.status === 401) return null;

  if (res.status === 403) {
    throw new Error("Access denied.");
  }

  if (!res.ok) {
    throw new Error(`Server error (HTTP ${res.status})`);
  }

  const json: AuthResponse<AdminUser> = await res.json().catch(() => ({
    success: false,
  }));

  return json.data ?? null;
}
