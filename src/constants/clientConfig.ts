// === ROUTE ===
export const ROUTE = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/accounts/recover",
  VERIFY_RECOVERY: "/accounts/recover/verify",

  HOME: "/",
  PROFILE: (
    username: string,
    type: "default" | "media" | "tagged" = "default"
  ) => `/profile/${username}${type !== "default" ? `/${type}` : ""}`,
  SEARCH: (query?: string, filter?: SearchCategory) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (filter) params.set("f", filter);
    const queryString = params.toString();
    return `/search${queryString ? `?${queryString}` : ""}`;
  },
  EXPLORE: (type: "media" | "moments" = "media") => `/explore/${type}`,
  FEED: (feedId: string) => `/feed/${feedId}`,
  MOMENT: (momentId: string, imgIndex?: number) =>
    `/moment/${momentId}${imgIndex ? `?imgIndex=${imgIndex}` : ""}`,
  MESSAGES: "/messages",
  MESSAGE: (contactId?: string) =>
    `/messages${contactId ? `/${contactId}` : ""}`,
  THOUGHT: "/messages/thought",
  NOTIFICATION: (type: "all" | "requests" | "social" = "all") =>
    `/notifications${type === "all" ? "" : `/${type}`}`,
  SETTINGS: "/settings",
  ARCHIVE: (type: "bookmarks" | "likes" = "bookmarks") => `/archive/${type}`,
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

// === Others ===
export const ASPECT_RATIO = {
  HORIZONTAL: 1.91 / 1,
  VERTICAL: 9 / 16,
};

export const PAGE_CONFIG = {
  MOMENT_CARD_PAGE: 50,
  MOMENT_CELL_PAGE: 50,
  COMMENT_PAGE: 20,
};

export enum Audience {
  PUBLIC = "public",
  FOLLOWERS = "followers",
  FRIENDS = "friends",
  VERIFIED = "verified",
  ONLY_ME = "only_me",
}

export enum SortBy {
  NEWEST = "newest",
  MOST_LIKED = "most_liked",
}

export const SEARCH_DEBOUNCE_TIME = 500;
export enum SearchCategory {
  TOP = "top",
  LATEST = "latest",
  PEOPLE = "people",
  HASHTAG = "tag",
  POSTS = "posts",
  MEDIA = "media",
}

export const MOBILE_BREAKPOINT = 560;
