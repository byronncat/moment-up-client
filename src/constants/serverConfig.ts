export const SERVER_HOST_URL =
  process.env.NEXT_PUBLIC_SERVER_HOST || "http://localhost:3000";

export const Api = {
  auth: {
    login: `${SERVER_HOST_URL}/v1/auth/login`,
    logout: `${SERVER_HOST_URL}/v1/auth/logout`,
    signup: `${SERVER_HOST_URL}/v1/auth/signup`,
    verify: `${SERVER_HOST_URL}/v1/auth/verify`,
  },
};
