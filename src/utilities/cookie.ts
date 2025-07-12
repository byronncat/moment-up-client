import { AUTH_COOKIE_NAME } from "@/constants/serverConfig";

const Cookie = {
  set: () =>
    `${AUTH_COOKIE_NAME}=; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=none`,
  remove: () =>
    `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=none`,
  exists: () => document.cookie.includes(AUTH_COOKIE_NAME),
} as const;

export default Cookie;
