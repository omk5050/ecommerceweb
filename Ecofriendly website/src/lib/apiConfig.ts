/**
 * Resolves the base URL for API requests.
 *
 * Behavior:
 * 1. If NEXT_PUBLIC_API_URL is explicitly defined, use it.
 * 2. In production (Render single web service), use same-origin relative URLs ("").
 * 3. In browser during local development:
 *    - If running on port 5000 (unified server), use same-origin relative URLs ("").
 *    - If running on port 3000 (standalone Next.js dev server), target "http://localhost:5000".
 * 4. In server-side execution during development, fallback to "http://localhost:5000".
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return "";
  }

  if (typeof window !== "undefined") {
    if (window.location.port === "5000") {
      return "";
    }
  }

  return "http://localhost:5000";
}
