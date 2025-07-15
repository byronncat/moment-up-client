import { SERVER_HOST_URL } from "@/constants/serverConfig";

export const ApiUrl = {
  // Auth
  auth: {
    login: `${SERVER_HOST_URL}/v1/auth/login`,
    signup: `${SERVER_HOST_URL}/v1/auth/register`,
    logout: `${SERVER_HOST_URL}/v1/auth/logout`,
    authenticate: `${SERVER_HOST_URL}/v1/auth/authenticate`,
    getCsrfToken: `${SERVER_HOST_URL}/v1/auth/csrf`,
    sendOtpEmail: `${SERVER_HOST_URL}/v1/auth/send-otp-email`,
    recoverPassword: `${SERVER_HOST_URL}/v1/auth/recover-password`,
  },

  // Core
  core: {
    getMoments: (page: number) => `${SERVER_HOST_URL}/v1/moments?page=${page}`,
  },

  // Suggestion
  suggestion: {
    users: `${SERVER_HOST_URL}/v1/suggestion/users`,
    trending: `${SERVER_HOST_URL}/v1/suggestion/trending`,
    report: `${SERVER_HOST_URL}/v1/suggestion/trending/report`,
  },

  // User
  user: {
    // Add user-specific URLs here when they exist
  },

  // Search
  search: {
    // Add search-specific URLs here when they exist
  },

  // Notification
  notification: {
    // Add notification-specific URLs here when they exist
  },
} as const;
