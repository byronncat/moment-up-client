import type { SearchCategory } from "./client";
import { type ExploreType, NotificationType } from "./server";
import { buildUrl } from "@/utilities";

export const ROUTE = {
  // === Auth ===
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

  // === Public ===
  PROFILE: (
    username?: string,
    type?: "media" | "tagged" | "following" | "followers"
  ) => {
    let path = "/profile";
    if (username)
      path = buildUrl("/profile/:username", { pathParams: { username } });
    if (type) path = buildUrl(`${path}/:type`, { pathParams: { type } });
    return path;
  },
  POST: (postId?: string, imgIndex?: number) =>
    postId
      ? buildUrl("/post/:postId", {
          pathParams: { postId },
          queryParams: { imgIndex },
        })
      : buildUrl("/post", { queryParams: { imgIndex } }),

  // === Private ===
  HOME: "/",
  EXPLORE: (type?: ExploreType) =>
    type ? buildUrl("/explore/:type", { pathParams: { type } }) : "/explore",
  SEARCH: (query?: string, filter?: SearchCategory) =>
    buildUrl("/search", {
      queryParams: {
        [SearchParamName.QUERY]: query,
        [SearchParamName.CATEGORY]: filter,
      },
      useSetForQuery: true,
    }),
  POST_CREATE: "/post/create",
  STORY: (username?: string, storyId?: string) => {
    let path = "/stories";
    if (username)
      path = buildUrl("/stories/:username", { pathParams: { username } });
    if (storyId)
      path = buildUrl(`${path}/:storyId`, { pathParams: { storyId } });
    return path;
  },
  STORY_CREATE: "/stories/create",
  MESSAGES: "/messages",
  MESSAGE: (contactId?: string) =>
    contactId
      ? buildUrl("/messages/:contactId", { pathParams: { contactId } })
      : "/messages",
  NOTIFICATION: (type: NotificationType = NotificationType.ALL) =>
    type === NotificationType.ALL
      ? "/notifications"
      : buildUrl("/notifications/:type", { pathParams: { type } }),
  SETTINGS: "/settings",
  ARCHIVE: (type: "bookmarks" | "likes" = "bookmarks") =>
    buildUrl("/archive/:type", { pathParams: { type } }),
};

export const PRIVATE_ROUTES = [
  ROUTE.HOME,
  ROUTE.STORY(),
  ROUTE.SEARCH(),
  ROUTE.POST_CREATE,
  ROUTE.STORY_CREATE,
  ROUTE.MESSAGE(),
  ROUTE.NOTIFICATION(),
  ROUTE.SETTINGS,
  ROUTE.ARCHIVE(),
  ROUTE.PROFILE("*", "media"),
  ROUTE.PROFILE("*", "tagged"),
  ROUTE.PROFILE("*", "following"),
  ROUTE.PROFILE("*", "followers"),
];
export const AUTH_ROUTES = [ROUTE.LOGIN, ROUTE.SIGNUP, ROUTE.FORGOT_PASSWORD];
export const PUBLIC_ROUTES = [ROUTE.EXPLORE(), ROUTE.PROFILE(), ROUTE.POST()];

export const SocialAuthError = {
  AccountBlocked: {
    code: "AccountBlocked",
    title: "Your account has been blocked",
    description: "Please contact support for assistance.",
  },
  Default: {
    code: "AuthenticationFailed",
    title: "Authentication failed",
    description: "Please try again.",
  },
};

export enum SearchParamName {
  QUERY = "query",
  CATEGORY = "category",
}
