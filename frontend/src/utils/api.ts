// Central place for API base URL so we don't hardcode localhost
// Priority: REACT_APP_API_URL env -> window.__API_URL__ (optional) -> default localhost:4000
export const API_URL: string =
  (process.env.REACT_APP_API_URL as string | undefined)?.trim() ||
  (typeof window !== "undefined" &&
    (window as any).__API_URL__?.toString().trim()) ||
  "http://localhost:4000";

export function isApiRequest(target: string): boolean {
  try {
    const base = new URL(API_URL);
    // If target is absolute
    if (/^https?:\/\//i.test(target)) {
      const u = new URL(target);
      return u.origin === base.origin && u.pathname.startsWith("/api");
    }
    // If relative, treat '/api' as API
    return target.startsWith("/api");
  } catch {
    // Fallback: treat '/api' paths as API
    return target.startsWith("/api");
  }
}
