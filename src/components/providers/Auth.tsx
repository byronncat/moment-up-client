"use client";

import type { z } from "zod";
import type { API, UserCardDisplayInfo, UserInfo } from "api";
import { ROUTE } from "@/constants/route";
import { AUTH_COOKIE_NAME } from "@/constants/serverConfig";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import zodSchema from "@/libraries/zodSchema";
import { AuthApi } from "@/services";
import { LoadingPage } from "../pages";

type AuthContextType = {
  user: UserInfo | null;
  logged?: boolean;
  loaded: boolean;
  tokens: {
    accessToken: string;
    csrfToken: string;
  };
  setLogged: (logged: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  login: (values: z.infer<typeof zodSchema.auth.login>) => API;
  switchLogin: (values: z.infer<typeof zodSchema.auth.login>) => API;
  signup: (values: z.infer<typeof zodSchema.auth.signup>) => API;
  logout: () => API;
  sendOtpEmail: (values: z.infer<typeof zodSchema.auth.sendOtpEmail>) => API;
  recoverPassword: (
    values: z.infer<typeof zodSchema.auth.recoverPassword>
  ) => API;
  changeAccount: (accountId: UserCardDisplayInfo["id"]) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  logged: false,
  loaded: false,
  tokens: {
    accessToken: "",
    csrfToken: "",
  },
  setLogged: () => {},
  setLoaded: () => {},
  login: async () => ({ success: false, message: "Something went wrong!" }),
  switchLogin: async () => ({
    success: false,
    message: "Something went wrong!",
  }),
  signup: async () => ({ success: false, message: "Something went wrong!" }),
  logout: async () => ({ success: false, message: "Something went wrong!" }),
  sendOtpEmail: async () => ({
    success: false,
    message: "Something went wrong!",
  }),
  recoverPassword: async () => ({
    success: false,
    message: "Something went wrong!",
  }),
  changeAccount: async () => {},
});

export const useAuth = () => useContext(AuthContext);
const PAGE_RELOAD_TIME = 1000;
const GUARD_COOKIE = `${AUTH_COOKIE_NAME}=; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=none`;
const REMOVE_GUARD_COOKIE = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=none`;

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<Omit<
    UserCardDisplayInfo,
    "followedBy" | "isFollowing"
  > | null>(null);

  const token = useRef({
    accessToken: "",
    csrfToken: "",
  });

  const authenticate = useCallback(async () => {
    const { success: successCsrf, data: dataCsrf } = await AuthApi.getCsrf();
    if (successCsrf) token.current.csrfToken = dataCsrf!.csrfToken;
    const { success: successVerify, data: dataVerify } =
      await AuthApi.authenticate();
    setLogged(successVerify);

    const hasGuardCookie = document.cookie.includes(AUTH_COOKIE_NAME);
    if (successVerify) {
      setUser(dataVerify!.user);
      token.current.accessToken = dataVerify!.accessToken;
      document.cookie = GUARD_COOKIE;
      if (!hasGuardCookie) {
        router.refresh();
        setTimeout(() => {
          setLoaded(true);
        }, PAGE_RELOAD_TIME);
        return;
      }
    } else {
      document.cookie = REMOVE_GUARD_COOKIE;
      if (hasGuardCookie) {
        router.refresh();
        setTimeout(() => {
          setLoaded(true);
        }, PAGE_RELOAD_TIME);
        return;
      }
    }

    setLoaded(true);
  }, [router]);

  const login = useCallback(
    async (values: z.infer<typeof zodSchema.auth.login>) => {
      const { success, message, data } = await AuthApi.login(
        values,
        token.current.csrfToken
      );
      if (success) {
        setLogged(true);
        setUser(data!.user);
        token.current.accessToken = data!.accessToken;
        document.cookie = GUARD_COOKIE;
        router.push(ROUTE.HOME);
      }
      return { success, message };
    },
    [router]
  );

  const switchLogin = useCallback(
    async (values: z.infer<typeof zodSchema.auth.login>) => {
      setLoaded(false);
      const { success, message } = await AuthApi.login(
        values,
        token.current.csrfToken
      );
      if (success) {
        router.refresh();
        router.push(ROUTE.HOME);
      }

      setTimeout(() => {
        setLoaded(true);
      }, PAGE_RELOAD_TIME); // Wait for the page to reload
      return { success, message };
    },
    [router]
  );

  const signup = useCallback(
    async (values: z.infer<typeof zodSchema.auth.signup>) => {
      const res = await AuthApi.signup(values, token.current.csrfToken);
      if (res.success) {
        setLogged(true);
        token.current.accessToken = "";
        router.push(`${ROUTE.LOGIN}?email=${encodeURIComponent(values.email)}`);
      }
      return res;
    },
    [router]
  );

  const logout = useCallback(async () => {
    setLoaded(false);
    const res = await AuthApi.logout(token.current.csrfToken);
    if (res.success) {
      setLogged(false);
      document.cookie = REMOVE_GUARD_COOKIE;
      router.push(ROUTE.LOGIN);
      setTimeout(() => {
        setLoaded(true);
      }, PAGE_RELOAD_TIME);
    } else setLoaded(true);

    return res;
  }, [router]);

  const sendOtpEmail = useCallback(
    async (values: z.infer<typeof zodSchema.auth.sendOtpEmail>) => {
      const res = await AuthApi.sendOtpEmail(values, token.current.csrfToken);
      return res;
    },
    []
  );

  const recoverPassword = useCallback(
    async (values: z.infer<typeof zodSchema.auth.recoverPassword>) => {
      const res = await AuthApi.recoverPassword(
        values,
        token.current.csrfToken
      );
      if (res.success) router.push(ROUTE.LOGIN);
      return res;
    },
    [router]
  );

  const changeAccount = useCallback(
    async (accountId: UserCardDisplayInfo["id"]) => {
      setLoaded(false);
      const res = await AuthApi.switchAccount(accountId);
      if (res.success) {
        router.refresh();
        router.push(ROUTE.HOME);
        setUser(res.data ?? null);
      }
      setLoaded(true);
    },
    [router]
  );

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        logged,
        tokens: {
          accessToken: token.current.accessToken,
          csrfToken: token.current.csrfToken,
        },
        setLogged,
        loaded,
        setLoaded,
        login,
        switchLogin,
        signup,
        logout,
        sendOtpEmail,
        recoverPassword,
        changeAccount,
      }}
    >
      {loaded ? children : <LoadingPage />}
    </AuthContext.Provider>
  );
}
