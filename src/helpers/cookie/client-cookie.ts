import { AUTH_COOKIE_NAME } from "@/constants/serverConfig";

const ClientCookie = {
  set: (value: string = ""): string =>
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=none`,

  get: (): string | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  },

  remove: (): string =>
    `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=none`,

  exists: (): boolean => {
    if (typeof document === "undefined") return false;
    return document.cookie.includes(AUTH_COOKIE_NAME);
  },

  getAuthHeaders: (): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const accessToken = ClientCookie.get();
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    return headers;
  },
} as const;

export default ClientCookie;
