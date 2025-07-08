import { SearchCategory } from "./clientConfig";

export const ROUTE = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

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
  NOTIFICATION: (type: "all" | "requests" | "social" = "all") =>
    `/notifications${type === "all" ? "" : `/${type}`}`,
  SETTINGS: "/settings",
  ARCHIVE: (type: "bookmarks" | "likes" = "bookmarks") => `/archive/${type}`,
};

export const PROTECTED_ROUTES = [ROUTE.HOME];
export const AUTH_ROUTES = [ROUTE.LOGIN, ROUTE.SIGNUP, ROUTE.FORGOT_PASSWORD];
export const PUBLIC_ROUTES = [
  ROUTE.LOGIN,
  ROUTE.SIGNUP,
  ROUTE.FORGOT_PASSWORD,
  ROUTE.PROFILE(""),
];
