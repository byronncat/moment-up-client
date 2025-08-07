"use client";

import type { z } from "zod";
import type { API, AccountInfo } from "api";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useAuthOperations, useRefreshApi } from "./hooks";
import { AuthApi, indexedDBService } from "@/services";
import ClientCookie from "@/helpers/client-cookie";
import zodSchema from "@/libraries/zodSchema";
import { ROUTE } from "@/constants/route";
import { PAGE_RELOAD_TIME, CookieName } from "@/constants/clientConfig";
import { LoadingPage } from "../pages";

export type Token = {
  csrfToken: string;
  accessToken: string;
};

type AuthContextType = {
  user: AccountInfo | null;
  logged?: boolean;
  loaded: boolean;
  token: Token;
  refresh: () => Promise<string>;
  setLogged: (logged: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  login: (values: z.infer<typeof zodSchema.auth.login>) => API;
  addAccount: (values: z.infer<typeof zodSchema.auth.login>) => API;
  signup: (values: z.infer<typeof zodSchema.auth.signup>) => API;
  logout: () => API;
  sendOtpEmail: (values: z.infer<typeof zodSchema.auth.sendOtpEmail>) => API;
  recoverPassword: (
    values: z.infer<typeof zodSchema.auth.recoverPassword>
  ) => API;
  switchAccount: (accountId: AccountInfo["id"]) => API;
  reload: () => Promise<void>;
};

const defaultResponse = {
  success: false,
  statusCode: 500,
  message: "Something went wrong!",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  logged: false,
  loaded: false,
  token: {
    csrfToken: "",
    accessToken: "",
  },
  refresh: async () => "",
  setLogged: () => {},
  setLoaded: () => {},
  login: async () => defaultResponse,
  addAccount: async () => defaultResponse,
  signup: async () => defaultResponse,
  logout: async () => defaultResponse,
  sendOtpEmail: async () => defaultResponse,
  recoverPassword: async () => defaultResponse,
  switchAccount: async () => defaultResponse,
  reload: async () => {},
});

export const useAuth = () => useContext(AuthContext);
export { useRefreshApi, useRefreshSWR } from "./hooks";

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<AccountInfo | null>(null);

  const authCookie = useMemo(() => ClientCookie(CookieName.AUTH_GUARD), []);
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

  const refresh = useCallback(async () => {
    const accessToken = await AuthApi.refresh();
    token.current.accessToken = accessToken;
    return accessToken;
  }, []);

  const login = useCallback(
    async (values: z.infer<typeof zodSchema.auth.login>) => {
      const { success, message, statusCode, data } = await AuthApi.login(
        values,
        token.current.csrfToken
      );
      if (success && data) {
        await indexedDBService.storeAccount(data.user);
        setLogged(true);
        setUser(data.user);
        token.current.accessToken = data.accessToken;
        document.cookie = authCookie.set();

        router.push(ROUTE.HOME);
      }
      return { success, message, statusCode };
    },
    [router, authCookie]
  );

  const addAccount = useCallback(
    async (values: z.infer<typeof zodSchema.auth.login>) => {
      const { success, message, statusCode, data } = await AuthApi.login(
        values,
        token.current.csrfToken
      );
      if (success && data) {
        await indexedDBService.storeAccount(data.user);
        setLogged(true);
        setUser(data.user);
        token.current.accessToken = data.accessToken;

        router.push(ROUTE.HOME);
      }
      return { success, message, statusCode };
    },
    [router]
  );

  const switchApi = useRefreshApi(AuthApi.switchAccount, {
    _token: token.current,
    _refresh: refresh,
  });
  const switchAccount = useCallback(
    async (accountId: AccountInfo["id"]) => {
      const { success, message, statusCode, data } = await switchApi(accountId);
      if (success && data) {
        setLogged(true);
        setUser(data.user);
        token.current.accessToken = data.accessToken;

        router.push(ROUTE.HOME);
      }
      return { success, message, statusCode };
    },
    [router, switchApi]
  );

  const signup = useCallback(
    async (values: z.infer<typeof zodSchema.auth.signup>) => {
      const { success, message, statusCode } = await AuthApi.signup(
        values,
        token.current.csrfToken
      );
      if (success) {
        setLogged(true);
        token.current.accessToken = "";
        router.push(`${ROUTE.LOGIN}?email=${encodeURIComponent(values.email)}`);
      }
      return { success, message, statusCode };
    },
    [router]
  );

  const logoutApi = useRefreshApi(AuthApi.logout, {
    _token: token.current,
    _refresh: refresh,
  });
  const logout = useCallback(async () => {
    setLoaded(false);
    const { success, message, statusCode } = await logoutApi();
    if (success) {
      if (user?.id) await indexedDBService.removeAccount(user.id);
      setLogged(false);
      setUser(null);
      token.current.accessToken = "";
      document.cookie = authCookie.remove();
      router.push(ROUTE.LOGIN);
      setTimeout(() => {
        setLoaded(true);
      }, PAGE_RELOAD_TIME);
    } else setLoaded(true);

    return { success, message, statusCode };
  }, [router, authCookie, logoutApi, user]);

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

  const reload = useCallback(async () => {
    setLoaded(false);
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, [setLoaded]);

  return (
    <AuthContext.Provider
      value={{
        user,
        logged,
        token: {
          csrfToken: token.current.csrfToken,
          accessToken: token.current.accessToken,
        },
        refresh,
        setLogged,
        loaded,
        setLoaded,
        login,
        addAccount,
        signup,
        logout,
        sendOtpEmail,
        recoverPassword,
        reload,
        switchAccount,
      }}
    >
      {loaded ? children : <LoadingPage />}
    </AuthContext.Provider>
  );
}
