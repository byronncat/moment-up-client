import { AUTH_COOKIE_NAME } from "@/constants/serverConfig";

let serverCookieHeader: string | null = null;

export function setCookieHeader(cookieHeader: string): void {
  serverCookieHeader = cookieHeader;
}

export function clearCookieHeader(): void {
  serverCookieHeader = null;
}

export function getCookieHeader(): string | null {
  return serverCookieHeader;
}

export function getAuthToken(): string | null {
  if (!serverCookieHeader) return null;

  const guardTokenMatch = serverCookieHeader.match(
    new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`)
  );
  return guardTokenMatch ? decodeURIComponent(guardTokenMatch[1]) : null;
}

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (serverCookieHeader) {
    const guardToken = getAuthToken();

    if (guardToken) {
      headers.Authorization = `Bearer ${guardToken}`;
    }
    headers.Cookie = serverCookieHeader;
  }

  return headers;
}

export function hasAuthCookie(): boolean {
  return serverCookieHeader
    ? serverCookieHeader.includes(AUTH_COOKIE_NAME)
    : false;
}

const ServerCookie = {
  setCookieHeader,
  clearCookieHeader,
  getCookieHeader,
  getAuthToken,
  getAuthHeaders,
  hasAuthCookie,
} as const;

export default ServerCookie;
