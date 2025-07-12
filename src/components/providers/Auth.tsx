"use client";

import type { z } from "zod";
import type { API, UserCardDisplayInfo, UserInfo } from "api";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useAuthOperations } from "./hooks/useAuthOperations";
import { AuthApi } from "@/services";
import { Cookie } from "@/utilities";
import zodSchema from "@/libraries/zodSchema";
import { ROUTE } from "@/constants/route";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";
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

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  const token = useRef({
    accessToken: "",
    csrfToken: "",
  });

  const { authenticate } = useAuthOperations({
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
        document.cookie = Cookie.set();
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
      }, PAGE_RELOAD_TIME);
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
      setUser(null);
      document.cookie = Cookie.remove();
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
