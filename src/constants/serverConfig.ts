export const ROUTE = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

  HOME: "/",
  PROFILE: (username: string) => `profile/${username}`,
  EXPLORE: "/explore",
};

export const PROTECTED_ROUTES = [ROUTE.HOME];
export const AUTH_ROUTES = [ROUTE.LOGIN, ROUTE.SIGNUP, ROUTE.FORGOT_PASSWORD];
export const PUBLIC_ROUTES = [
  ROUTE.LOGIN,
  ROUTE.SIGNUP,
  ROUTE.FORGOT_PASSWORD,
  ROUTE.EXPLORE,
  ROUTE.PROFILE(""),
];

export const SERVER_HOST_URL =
  process.env.NEXT_PUBLIC_SERVER_HOST || "http://localhost:3000";
