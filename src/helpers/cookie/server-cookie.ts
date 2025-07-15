let serverCookieHeader: string | null = null;

export function setHeader(cookieHeader: string): void {
  serverCookieHeader = cookieHeader;
}

export function clearHeader(): void {
  serverCookieHeader = null;
}

export function getHeader(): string | null {
  if (!serverCookieHeader || !serverCookieHeader.includes("=")) return null;
  return serverCookieHeader;
}

const ServerCookie = {
  setHeader,
  clearHeader,
  getHeader,
} as const;

export default ServerCookie;
