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
  SEARCH: (query?: string) =>
    `/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
  EXPLORE: (type: "media" | "moments" = "media") => `/explore/${type}`,
  FEED: (feedId: string) => `/feed/${feedId}`,
  MOMENT: (momentId: string) => `/moment/${momentId}`,
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

export const ASPECT_RATIO = {
  HORIZONTAL: 1.91 / 1,
  VERTICAL: 9 / 16,
};
