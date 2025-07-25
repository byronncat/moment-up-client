import { SERVER_HOST_URL } from "@/constants/serverConfig";

export const ApiUrl = {
  // Auth
  auth: {
    login: `${SERVER_HOST_URL}/v1/auth/login`,
    switch: `${SERVER_HOST_URL}/v1/auth/switch-account`,
    signup: `${SERVER_HOST_URL}/v1/auth/register`,
    logout: `${SERVER_HOST_URL}/v1/auth/logout`,
    csrf: `${SERVER_HOST_URL}/v1/auth/csrf`,
    refresh: `${SERVER_HOST_URL}/v1/auth/refresh`,
    me: `${SERVER_HOST_URL}/v1/auth/me`,
    sendOtpEmail: `${SERVER_HOST_URL}/v1/auth/send-otp-email`,
    recoverPassword: `${SERVER_HOST_URL}/v1/auth/recover-password`,
  },

  // Core
  moment: {
    home: (page?: number, limit?: number) =>
      `${SERVER_HOST_URL}/v1/moments/home` +
      (page ? `?page=${page}` : "") +
      (limit ? `&limit=${limit}` : ""),
    explore: (type?: "media" | "post", page?: number, limit?: number) =>
      `${SERVER_HOST_URL}/v1/moments/explore` +
      (type ? `?type=${type}` : "") +
      (page ? `&page=${page}` : "") +
      (limit ? `&limit=${limit}` : ""),
    user: (
      userId: string,
      filter?: "media" | "tagged" | "reposts" | "liked",
      page?: number,
      limit?: number
    ) =>
      `${SERVER_HOST_URL}/v1/moments/user/${userId}` +
      (page ? `?page=${page}` : "") +
      (filter ? `&filter=${filter}` : "") +
      (limit ? `&limit=${limit}` : ""),
    get: (momentId: string) => `${SERVER_HOST_URL}/v1/moments/${momentId}`,
    like: (momentId: string) =>
      `${SERVER_HOST_URL}/v1/moments/${momentId}/like`,
    unlike: (momentId: string) =>
      `${SERVER_HOST_URL}/v1/moments/${momentId}/unlike`,
    bookmark: (momentId: string) =>
      `${SERVER_HOST_URL}/v1/moments/${momentId}/bookmark`,
    unbookmark: (momentId: string) =>
      `${SERVER_HOST_URL}/v1/moments/${momentId}/unbookmark`,
    repost: (momentId: string) =>
      `${SERVER_HOST_URL}/v1/moments/${momentId}/repost`,
  },

  feed: {
    get: `${SERVER_HOST_URL}/v1/feeds`,
  },

  // Suggestion
  suggestion: {
    users: `${SERVER_HOST_URL}/v1/suggestion/users`,
    trending: `${SERVER_HOST_URL}/v1/suggestion/trending`,
    report: `${SERVER_HOST_URL}/v1/suggestion/trending/report`,
  },

  // User
  user: {
    follow: (userId: string) => `${SERVER_HOST_URL}/v1/users/${userId}/follow`,
    unfollow: (userId: string) =>
      `${SERVER_HOST_URL}/v1/users/${userId}/unfollow`,
    block: (userId: string) => `${SERVER_HOST_URL}/v1/users/${userId}/block`,
    unblock: (userId: string) =>
      `${SERVER_HOST_URL}/v1/users/${userId}/unblock`,
    getProfile: (username: string) => `${SERVER_HOST_URL}/v1/users/${username}`,
  },

  // Search
  search: {
    search: (
      query: string,
      type?: SearchQueryParams,
      page?: number,
      limit?: number
    ) =>
      `${SERVER_HOST_URL}/v1/search?query=${encodeURIComponent(query)}` +
      (type ? `&type=${encodeURIComponent(type)}` : "") +
      (page ? `&page=${page}` : "") +
      (limit ? `&limit=${limit}` : ""),
    getHistory: (limit?: number) =>
      `${SERVER_HOST_URL}/v1/search/history` + (limit ? `?limit=${limit}` : ""),
    clearHistory: `${SERVER_HOST_URL}/v1/search/history/clear`,
    removeHistoryItem: (itemId: string) =>
      `${SERVER_HOST_URL}/v1/search/history/${itemId}`,
  },

  // Notification
  notification: {
    // Add notification-specific URLs here when they exist
  },
} as const;

export type SearchQueryParams =
  | "user"
  | "post"
  | "hashtag"
  | "user&post"
  | "user&hashtag"
  | "post&hashtag"
  | "user&post&hashtag";
