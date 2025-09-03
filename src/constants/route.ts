import type { SearchCategory } from "./clientConfig";
import { type ExploreType, NotificationType } from "./serverConfig";

export const ROUTE = {
  // === Auth ===
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

  // === Public ===
  PROFILE: (username?: string, type?: "media" | "tagged") =>
    `/profile${username ? `/${username}` : ""}${type ? `/${type}` : ""}`,
  MOMENT: (momentId?: string, imgIndex?: number) =>
    `/moment${momentId ? `/${momentId}` : ""}${imgIndex ? `?imgIndex=${imgIndex}` : ""}`,

  // === Private ===
  HOME: "/",
  EXPLORE: (type?: ExploreType) => `/explore${type ? `/${type}` : ""}`,
  SEARCH: (query?: string, filter?: SearchCategory) => {
    const params = new URLSearchParams();
    if (query) params.set(SearchParamName.QUERY, query);
    if (filter) params.set(SearchParamName.CATEGORY, filter);
    const queryString = params.toString();
    return `/search${queryString ? `?${queryString}` : ""}`;
  },
  MOMENT_CREATE: "/moment/create",
  STORY: (username?: string, storyId?: string) =>
    `/stories${username ? `/${username}` : ""}${storyId ? `/${storyId}` : ""}`,
  STORY_CREATE: "/stories/create",
  MESSAGES: "/messages",
  MESSAGE: (contactId?: string) =>
    `/messages${contactId ? `/${contactId}` : ""}`,
  NOTIFICATION: (type: NotificationType = NotificationType.ALL) =>
    `/notifications${type === NotificationType.ALL ? "" : `/${type}`}`,
  SETTINGS: "/settings",
  ARCHIVE: (type: "bookmarks" | "likes" = "bookmarks") => `/archive/${type}`,
};

export const PRIVATE_ROUTES = [
  ROUTE.HOME,
  ROUTE.EXPLORE(),
  ROUTE.STORY(),
  ROUTE.SEARCH(),
  ROUTE.MOMENT_CREATE,
  ROUTE.STORY_CREATE,
  ROUTE.MESSAGE(),
  ROUTE.NOTIFICATION(),
  ROUTE.SETTINGS,
  ROUTE.ARCHIVE(),
];
export const AUTH_ROUTES = [ROUTE.LOGIN, ROUTE.SIGNUP, ROUTE.FORGOT_PASSWORD];
export const PUBLIC_ROUTES = [ROUTE.PROFILE(), ROUTE.MOMENT()];

export const LOGIN_ERRORS = {
  missing_token:
    "Authentication token is missing. Please try logging in again.",
  invalid_token: "Invalid authentication token. Please try logging in again.",
  expired_token: "Authentication session expired. Please try logging in again.",
  social_auth_failed: "Social authentication failed. Please try again.",
  default: "Authentication failed. Please try again.",
};

export enum SearchParamName {
  QUERY = "query",
  CATEGORY = "category",
}
