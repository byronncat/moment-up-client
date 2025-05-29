// === ROUTE ===
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
  SEARCH: (query?: string, filter?: SEARCH_CATEGORY) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filter) params.set('f', filter);
    const queryString = params.toString();
    return `/search${queryString ? `?${queryString}` : ''}`;
  },
  EXPLORE: (type: "media" | "moments" = "media") => `/explore/${type}`,
  FEED: (feedId: string) => `/feed/${feedId}`,
  MOMENT: (momentId: string) => `/moment/${momentId}`,
  MESSAGES: "/messages",
  MESSAGE: (contactId?: string) =>
    `/messages${contactId ? `/${contactId}` : ""}`,
  THOUGHT: "/messages/thought",
  NOTIFICATION: (type: "all" | "requests" | "information" = "all") =>
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

// === UI ===
export const ASPECT_RATIO = {
  HORIZONTAL: 1.91 / 1,
  VERTICAL: 9 / 16,
};

export const PAGE_CONFIG = {
  MOMENT_CARD_PAGE: 50,
  MOMENT_CELL_PAGE: 24,
};

export const SEARCH_DEBOUNCE_TIME = 500;
export enum SEARCH_CATEGORY {
  TOP = "top",
  LATEST = "latest",
  PEOPLE = "people",
  HASHTAG = "tag",
  POSTS = "posts",
  MEDIA = "media",
}