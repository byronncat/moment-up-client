"use client";

import type { z } from "zod";
import type { API, UserCardDisplayInfo, UserInfo } from "api";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useAuthOperations } from "./hooks/useAuthOperations";
import { AuthApi } from "@/services";
import { ClientCookie } from "@/helpers/cookie";
import zodSchema from "@/libraries/zodSchema";
import { ROUTE } from "@/constants/route";
import { PAGE_RELOAD_TIME, AUTH_COOKIE_NAME } from "@/constants/clientConfig";
import { LoadingPage } from "../pages";

export type Token = {
  csrfToken: string;
  accessToken: string;
};

type AuthContextType = {
  user: UserInfo | null;
  logged?: boolean;
  loaded: boolean;
  token: Token;
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
  token: {
    csrfToken: "",
    accessToken: "",
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

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  const authCookie = useMemo(() => ClientCookie(AUTH_COOKIE_NAME), []);
  const token = useRef({
    accessToken: "",
    csrfToken: "",
  });

  useAuthOperations({
    setLogged,
    setLoaded,
    setUser,
    token,
  });

  const login = useCallback(
    async (values: z.infer<typeof zodSchema.auth.login>) => {
      const { success, message, data } = await AuthApi.login(
        values,
        token.current.csrfToken
      );
      if (success && data) {
        setLogged(true);
        setUser(data.user);
        token.current.accessToken = data.accessToken;
        document.cookie = authCookie.set();
        router.push(ROUTE.HOME);
      }
      return { success, message };
    },
    [router, authCookie]
  );

  const switchLogin = useCallback(
    async (values: z.infer<typeof zodSchema.auth.login>) => {
      setLoaded(false);
      const { success, message, data } = await AuthApi.login(
        values,
        token.current.csrfToken
      );
      if (success && data) {
        setLogged(true);
        // setUser(data);
        document.cookie = authCookie.set();
        router.refresh();
        router.push(ROUTE.HOME);
      }

      setTimeout(() => {
        setLoaded(true);
      }, PAGE_RELOAD_TIME);
      return { success, message };
    },
    [router, authCookie]
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
      setUser(null);
      token.current.accessToken = "";
      document.cookie = authCookie.remove();
      router.push(ROUTE.LOGIN);
      setTimeout(() => {
        setLoaded(true);
      }, PAGE_RELOAD_TIME);
    } else setLoaded(true);

    return res;
  }, [router, authCookie]);

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

  // const changeAccount = useCallback(
  //   async (accountId: UserCardDisplayInfo["id"]) => {
  //     setLoaded(false);
  //     const res = await AuthApi.switchAccount(accountId);
  //     if (res.success && res.data) {
  //       // Update access token if provided
  //       if (res.data.accessToken) {
  //         token.current.accessToken = res.data.accessToken;
  //         document.cookie = ClientCookie.set();
  //       }
  //       setUser(res.data ?? null);
  //       router.refresh();
  //       router.push(ROUTE.HOME);
  //     }
  //     setLoaded(true);
  //   },
  //   [router]
  // );

  return (
    <AuthContext.Provider
      value={{
        user,
        logged,
        token: {
          csrfToken: token.current.csrfToken,
          accessToken: token.current.accessToken,
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
        changeAccount: () => {
          return Promise.resolve();
        },
      }}
    >
      {loaded ? children : <LoadingPage />}
    </AuthContext.Provider>
  );
}
