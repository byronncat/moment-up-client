export const ROUTE = {
  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

  // Protected
  HOME: "/",
  PROFILE: (username: string) => `profile/${username}`,
  EXPLORE: "/explore",
};
