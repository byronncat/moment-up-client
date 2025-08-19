import { SearchCategory } from "./clientConfig";
import { ExploreType, NotificationType } from "./serverConfig";

export const ROUTE = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

  HOME: "/",
  PROFILE: (username?: string, type?: "media" | "tagged") =>
    `/profile${username ? `/${username}` : ""}${type ? `/${type}` : ""}`,
  SEARCH: (query?: string, filter?: SearchCategory) => {
    const params = new URLSearchParams();
    if (query) params.set(SearchParamName.QUERY, query);
    if (filter) params.set(SearchParamName.CATEGORY, filter);
    const queryString = params.toString();
    return `/search${queryString ? `?${queryString}` : ""}`;
  },
  EXPLORE: (type?: ExploreType) => "/explore" + (type ? `/${type}` : ""),
  STORY: (username?: string, storyId?: string) =>
    `/stories${username ? `/${username}` : ""}${storyId ? `/${storyId}` : ""}`,
  STORY_CREATE: "/stories/create",
  MOMENT: (momentId: string, imgIndex?: number) =>
    `/moment/${momentId}${imgIndex ? `?imgIndex=${imgIndex}` : ""}`,
  MESSAGES: "/messages",
  MESSAGE: (contactId?: string) =>
    `/messages${contactId ? `/${contactId}` : ""}`,
  NOTIFICATION: (type: NotificationType = NotificationType.ALL) =>
    `/notifications${type === "all" ? "" : `/${type}`}`,
  SETTINGS: "/settings",
  ARCHIVE: (type: "bookmarks" | "likes" = "bookmarks") => `/archive/${type}`,
};

export const PRIVATE_ROUTES = [ROUTE.HOME, ROUTE.EXPLORE(), ROUTE.STORY()];
export const AUTH_ROUTES = [ROUTE.LOGIN, ROUTE.SIGNUP, ROUTE.FORGOT_PASSWORD];
export const PUBLIC_ROUTES = [ROUTE.PROFILE()];

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
