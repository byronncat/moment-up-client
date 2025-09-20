import { SERVER_HOST_URL } from "@/constants/server";

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
    sendOtpEmail: `${SERVER_HOST_URL}/v1/auth/send-otp-email`,
    recoverPassword: `${SERVER_HOST_URL}/v1/auth/recover-password`,
    addGoogleAccount: `${SERVER_HOST_URL}/v1/auth/google/add-account`,
  },

  // === Core ===
  post: {
    home: (page?: number, limit?: number) => {
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      const queryString = params.toString();
      return `${SERVER_HOST_URL}/v1/posts/home${queryString ? `?${queryString}` : ""}`;
    },
    explore: (type?: "media" | "post", page?: number, limit?: number) => {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      const queryString = params.toString();
      return `${SERVER_HOST_URL}/v1/posts/explore${queryString ? `?${queryString}` : ""}`;
    },
    user: (
      userId: string,
      filter?: "media" | "tagged" | "reposts" | "liked",
      page?: number,
      limit?: number
    ) => {
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (filter) params.append("filter", filter);
      if (limit) params.append("limit", limit.toString());
      const queryString = params.toString();
      return `${SERVER_HOST_URL}/v1/posts/user/${userId}${queryString ? `?${queryString}` : ""}`;
    },
    getById: (momentId: string) => `${SERVER_HOST_URL}/v1/posts/${momentId}`,
    create: `${SERVER_HOST_URL}/v1/posts`,
    like: (momentId: string) => `${SERVER_HOST_URL}/v1/posts/${momentId}/like`,
    unlike: (momentId: string) =>
      `${SERVER_HOST_URL}/v1/posts/${momentId}/unlike`,
    bookmark: (momentId: string) =>
      `${SERVER_HOST_URL}/v1/posts/${momentId}/bookmark`,
    unbookmark: (momentId: string) =>
      `${SERVER_HOST_URL}/v1/posts/${momentId}/unbookmark`,
    repost: (momentId: string) =>
      `${SERVER_HOST_URL}/v1/posts/${momentId}/repost`,
  },

  story: {
    get: `${SERVER_HOST_URL}/v1/stories`,
    getByUsername: (username: string) =>
      `${SERVER_HOST_URL}/v1/stories/user/${username}`,
    delete: (id: string) => `${SERVER_HOST_URL}/v1/stories/${id}`,
  },

  comment: {
    get: (momentId: string, page?: number, limit?: number) => {
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      const queryString = params.toString();
      return `${SERVER_HOST_URL}/v1/comments/moment/${momentId}${queryString ? `?${queryString}` : ""}`;
    },
    add: `${SERVER_HOST_URL}/v1/comments`,
    like: (commentId: string) =>
      `${SERVER_HOST_URL}/v1/comments/${commentId}/like`,
    unlike: (commentId: string) =>
      `${SERVER_HOST_URL}/v1/comments/${commentId}/unlike`,
    delete: (commentId: string) =>
      `${SERVER_HOST_URL}/v1/comments/${commentId}`,
  },

  // === Suggestion ===
  suggestion: {
    users: `${SERVER_HOST_URL}/v1/suggestion/users`,
    trending: `${SERVER_HOST_URL}/v1/suggestion/trending?limit=5`,
    report: `${SERVER_HOST_URL}/v1/suggestion/trending/report`,
    popular: `${SERVER_HOST_URL}/v1/suggestion/popular`,
  },

  // === User ===
  user: {
    follow: (userId: string) => `${SERVER_HOST_URL}/v1/users/${userId}/follow`,
    unfollow: (userId: string) =>
      `${SERVER_HOST_URL}/v1/users/${userId}/unfollow`,
    block: (userId: string) => `${SERVER_HOST_URL}/v1/users/${userId}/block`,
    unblock: (userId: string) =>
      `${SERVER_HOST_URL}/v1/users/${userId}/unblock`,
    mute: (userId: string) => `${SERVER_HOST_URL}/v1/users/${userId}/mute`,
    unmute: (userId: string) => `${SERVER_HOST_URL}/v1/users/${userId}/unmute`,
    report: (userId: string) => `${SERVER_HOST_URL}/v1/users/${userId}/report`,
    getProfile: (username: string) => `${SERVER_HOST_URL}/v1/users/${username}`,
    updateProfile: (userId: string) => `${SERVER_HOST_URL}/v1/users/${userId}`,
  },

  // === Search ===
  search: {
    search: (
      query: string,
      type?: SearchTypeParams,
      order?: SearchSortParams,
      page?: number,
      limit?: number
    ) => {
      const params = new URLSearchParams();
      params.append("query", query);
      if (type) params.append("type", type);
      if (order) params.append("order", order);
      if (page !== undefined) params.append("page", page.toString());
      if (limit !== undefined) params.append("limit", limit.toString());
      return `${SERVER_HOST_URL}/v1/search?${params.toString()}`;
    },
    getHistory: (limit?: number) => {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());
      const queryString = params.toString();
      return `${SERVER_HOST_URL}/v1/search/history${queryString ? `?${queryString}` : ""}`;
    },
    clearHistory: `${SERVER_HOST_URL}/v1/search/history/clear`,
    removeHistoryItem: (itemId: string) =>
      `${SERVER_HOST_URL}/v1/search/history/${itemId}`,
  },

  // === Notification ===
  notification: {
    get: (
      type: "all" | "request" | "social",
      page?: number,
      limit?: number
    ) => {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      const queryString = params.toString();
      return `${SERVER_HOST_URL}/v1/notifications${queryString ? `?${queryString}` : ""}`;
    },
  },
} as const;

export type SearchTypeParams =
  | "user"
  | "hashtag"
  | "post"
  | "media"
  | "user&hashtag"
  | "user&hashtag&post"
  | "alll";

export type SearchSortParams = "most_popular" | "newest";
