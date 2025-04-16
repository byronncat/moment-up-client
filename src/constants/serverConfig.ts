export const ROUTE = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/accounts/recover",
  VERIFY_RECOVERY: "/accounts/recover/verify",

  HOME: "/",
  PROFILE: (
    username: string,
    type: "default" | "media" | "likes" = "default"
  ) => `/profile/${username}${type !== "default" ? `/${type}` : ""}`,
  SEARCH: "/search",
  EXPLORE: (type: "media" | "moments" = "media") => `/explore/${type}`,
  MESSAGES: "/messages",
  MESSAGE: (contactId?: string) =>
    `/messages${contactId ? `/${contactId}` : ""}`,
  THOUGHT: "/messages/thought",
  NOTIFICATION: (type: "all" | "mentions" = "all") =>
    `/notifications${type === "all" ? "" : `/${type}`}`,
  SETTINGS: "/settings",
};

export const PROTECTED_ROUTES = [ROUTE.HOME];
export const AUTH_ROUTES = [
  ROUTE.LOGIN,
  ROUTE.SIGNUP,
  ROUTE.FORGOT_PASSWORD,
  ROUTE.VERIFY_RECOVERY,
];
export const PUBLIC_ROUTES = [
  ROUTE.LOGIN,
  ROUTE.SIGNUP,
  ROUTE.FORGOT_PASSWORD,
  ROUTE.VERIFY_RECOVERY,
  ROUTE.PROFILE(""),
];

export const SERVER_HOST_URL =
  process.env.NEXT_PUBLIC_SERVER_HOST || "http://localhost:3000";
