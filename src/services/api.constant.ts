import type { SortBy } from "@/constants/client";
import { SERVER_HOST_URL } from "@/constants/server";
import { buildUrl } from "@/utilities";

export const ApiUrl = {
  // === Auth ===
  auth: {
    login: `${SERVER_HOST_URL}/v1/auth/login`,
    switch: `${SERVER_HOST_URL}/v1/auth/switch-account`,
    signup: `${SERVER_HOST_URL}/v1/auth/register`,
    logout: `${SERVER_HOST_URL}/v1/auth/logout`,
    csrf: `${SERVER_HOST_URL}/v1/auth/csrf`,
    refresh: `${SERVER_HOST_URL}/v1/auth/refresh`,
    me: `${SERVER_HOST_URL}/v1/auth/me`,
    sendOtp: `${SERVER_HOST_URL}/v1/auth/send-otp-email`,
    recoverPassword: `${SERVER_HOST_URL}/v1/auth/recover-password`,
    addGoogleAccount: `${SERVER_HOST_URL}/v1/auth/google/add-account`,
  },

  // === User ===
  user: {
    getProfile: (username: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:username`, {
        pathParams: { username },
      }),
    updateProfile: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId`, {
        pathParams: { userId },
      }),
    getFollowers: (userId: string, page?: number, limit?: number) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/followers`, {
        pathParams: { userId },
        queryParams: { page, limit },
      }),
    getFollowing: (userId: string, page?: number, limit?: number) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/following`, {
        pathParams: { userId },
        queryParams: { page, limit },
      }),
    follow: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/follow`, {
        pathParams: { userId },
      }),
    unfollow: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/unfollow`, {
        pathParams: { userId },
      }),
    acceptFollowRequest: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/follow-request/accept`, {
        pathParams: { userId },
      }),
    declineFollowRequest: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/follow-request/decline`, {
        pathParams: { userId },
      }),
    removeFollower: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/remove-follower`, {
        pathParams: { userId },
      }),
    block: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/block`, {
        pathParams: { userId },
      }),
    unblock: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/unblock`, {
        pathParams: { userId },
      }),
    mute: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/mute`, {
        pathParams: { userId },
      }),
    unmute: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/unmute`, {
        pathParams: { userId },
      }),
    report: (userId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/users/:userId/report`, {
        pathParams: { userId },
      }),
  },

  // === Suggestion ===
  suggestion: {
    users: `${SERVER_HOST_URL}/v1/suggestion/users`,
    popular: `${SERVER_HOST_URL}/v1/suggestion/popular`,
    trending: buildUrl(`${SERVER_HOST_URL}/v1/suggestion/trending`, {
      queryParams: { limit: 5 },
    }),
    report: `${SERVER_HOST_URL}/v1/suggestion/trending/report`,
  },

  // === Core ===
  post: {
    home: (page?: number, limit?: number) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/home`, {
        queryParams: { page, limit },
      }),
    explore: (type?: "media" | "post", page?: number, limit?: number) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/explore`, {
        queryParams: { type, page, limit },
      }),
    user: (
      userId: string,
      filter?: "media" | "tagged" | "reposts" | "like" | "bookmark",
      page?: number,
      limit?: number
    ) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/user/:userId`, {
        pathParams: { userId },
        queryParams: { filter, page, limit },
      }),
    getById: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId`, {
        pathParams: { postId },
      }),
    getMetadata: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId/metadata`, {
        pathParams: { postId },
      }),
    create: `${SERVER_HOST_URL}/v1/posts`,
    update: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId`, {
        pathParams: { postId },
      }),
    delete: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId`, {
        pathParams: { postId },
      }),
    like: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId/like`, {
        pathParams: { postId },
      }),
    unlike: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId/unlike`, {
        pathParams: { postId },
      }),
    bookmark: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId/bookmark`, {
        pathParams: { postId },
      }),
    unbookmark: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId/unbookmark`, {
        pathParams: { postId },
      }),
    repost: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId/repost`, {
        pathParams: { postId },
      }),
    report: (postId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/posts/:postId/report`, {
        pathParams: { postId },
      }),
  },

  story: {
    get: `${SERVER_HOST_URL}/v1/stories`,
    create: `${SERVER_HOST_URL}/v1/stories`,
    getByUsername: (username: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/stories/user/:username`, {
        pathParams: { username },
      }),
    delete: (id: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/stories/:id`, { pathParams: { id } }),
    report: (id: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/stories/:id/report`, {
        pathParams: { id },
      }),
  },

  comment: {
    get: (postId: string, page?: number, limit?: number, sortBy?: SortBy) =>
      buildUrl(`${SERVER_HOST_URL}/v1/comments/post/:postId`, {
        pathParams: { postId },
        queryParams: { page, limit, sortBy },
      }),
    create: `${SERVER_HOST_URL}/v1/comments`,
    like: (commentId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/comments/:commentId/like`, {
        pathParams: { commentId },
      }),
    unlike: (commentId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/comments/:commentId/unlike`, {
        pathParams: { commentId },
      }),
    delete: (commentId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/comments/:commentId`, {
        pathParams: { commentId },
      }),
  },

  // === Search ===
  search: {
    search: (
      query: string,
      filter?: SearchFilterParams,
      page?: number,
      limit?: number
    ) =>
      buildUrl(`${SERVER_HOST_URL}/v1/search`, {
        queryParams: { query, filter, page, limit },
      }),
    getHistory: (limit?: number) =>
      buildUrl(`${SERVER_HOST_URL}/v1/search/history`, {
        queryParams: { limit },
      }),
    clearHistory: `${SERVER_HOST_URL}/v1/search/history/clear`,
    removeHistoryItem: (itemId: string) =>
      buildUrl(`${SERVER_HOST_URL}/v1/search/history/:itemId`, {
        pathParams: { itemId },
      }),
  },

  // === Notification ===
  notification: {
    get: (page?: number, limit?: number) =>
      buildUrl(`${SERVER_HOST_URL}/v1/notifications`, {
        queryParams: { page, limit },
      }),
  },
} as const;

export type SearchFilterParams =
  | "user"
  | "hashtag"
  | "post"
  | "media"
  | "user&hashtag"
  | "user&hashtag&post"
  | "all";
