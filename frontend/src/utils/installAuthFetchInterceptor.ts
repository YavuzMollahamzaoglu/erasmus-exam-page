import { API_URL, isApiRequest } from "./api";

export function installAuthFetchInterceptor(onExpired: () => void) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.__authFetchInstalled) return;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url =
        typeof input === "string" ? input : (input as any).url || String(input);
      let targetStr = url;
      let isApiCall = isApiRequest(url);
      // Rewrite relative '/api' to configured API_URL
      if (typeof url === "string" && url.startsWith("/api")) {
        targetStr = `${API_URL}${url}`;
        isApiCall = true;
      }
      // Rewrite absolute localhost:4000 to configured API_URL (preserve path/query)
      if (
        typeof url === "string" &&
        /^https?:\/\/localhost:4000\//i.test(url)
      ) {
        try {
          const u = new URL(url);
          const base = new URL(API_URL);
          targetStr = `${base.origin}${u.pathname}${u.search}`;
          isApiCall = true;
        } catch {}
      }
      const headers = new Headers(init?.headers || {});
      let attachedAuth = false;
      if (isApiCall) {
        const jwt = localStorage.getItem("token");
        if (jwt && !headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${jwt}`);
          attachedAuth = true;
        } else if (headers.has("Authorization")) {
          attachedAuth = true;
        }
      }
      const target: RequestInfo | URL =
        typeof input === "string" ? targetStr : targetStr;
      const resp = await originalFetch(target, { ...init, headers });
      if (
        isApiCall &&
        attachedAuth &&
        (resp.status === 401 || resp.status === 403)
      ) {
        try {
          onExpired?.();
        } catch {}
      }
      return resp;
    } catch (e) {
      // In case of wrapping error, fallback to original fetch
      return originalFetch(input, init);
    }
  };
  w.__authFetchInstalled = true;
}
