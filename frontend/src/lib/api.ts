/// <reference types="vite/client" />
// Without the reference above, `import.meta.env` is not typed and `tsc --noEmit` fails --
// which `vite build` does not catch, because it tree-shakes this module out when no screen
// imports it yet.
//
// Where the generated API lives.
//
// Set at build time: the platform bakes the deployed API URL into the frontend build. The
// fallback is the local backend so a bare `npm run dev` still points somewhere real.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// The shared bearer the deployed API expects (its SECRET_KEY). The platform bakes the
// same value into both sides at deploy time, so authenticated calls work out of the box.
export const API_SECRET_KEY: string = import.meta.env.VITE_API_SECRET_KEY ?? "";

/** A failed `apiFetch` call: the HTTP status and whatever JSON body (if any) came with it. */
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `request failed: ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// Screens that need to react to a session dying mid-use (expired cookie, signed out
// elsewhere) listen for this on `window` instead of every screen re-deriving it from a
// caught error. Not dispatched for `/auth/*` calls -- a 401 there is an expected
// sign-in/sign-up outcome, not a dead session.
export const UNAUTHORIZED_EVENT = "api:unauthorized";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(API_SECRET_KEY ? { Authorization: `Bearer ${API_SECRET_KEY}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    let body: unknown = undefined;
    try {
      body = await response.json();
    } catch {
      // No JSON body (or an empty one) -- `body` stays undefined.
    }
    if (response.status === 401 && !path.startsWith("/auth") && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT, { detail: { path } }));
    }
    throw new ApiError(
      response.status,
      body,
      `${init?.method ?? "GET"} ${path} failed: ${response.status}`,
    );
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}
