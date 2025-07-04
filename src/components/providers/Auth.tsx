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
import { toast } from "sonner";
import zodSchema from "@/libraries/zodSchema";
import { AuthApi } from "@/services";
import { ROUTE } from "@/constants/route";
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
  sendRecoveryEmail: (
    values: z.infer<typeof zodSchema.auth.sendRecoveryEmail>
  ) => API;
  changePassword: (
    values: z.infer<typeof zodSchema.auth.changePassword>
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
  login: async () => ({ success: false, message: "" }),
  switchLogin: async () => ({ success: false, message: "" }),
  signup: async () => ({ success: false, message: "" }),
  logout: async () => ({ success: false, message: "" }),
  sendRecoveryEmail: async () => ({ success: false, message: "" }),
  changePassword: async () => ({ success: false, message: "" }),
  changeAccount: async () => {},
});

export const useAuth = () => useContext(AuthContext);
const PAGE_RELOAD_TIME = 1000;

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
    const { success: successVerify, data: dataVerify } = await AuthApi.verify(
      token.current.csrfToken
    );
    if (successVerify) {
      setUser(dataVerify!.user);
      token.current.accessToken = dataVerify!.accessToken;
      router.push(ROUTE.HOME);
    }

    setLogged(successVerify);
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
      const res = await AuthApi.signup(values);
      if (res.success) {
        setLogged(true);
        token.current.accessToken = "";
        router.push(ROUTE.HOME);
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
      router.push(ROUTE.LOGIN);
      setTimeout(() => {
        setLoaded(true);
      }, PAGE_RELOAD_TIME);
    } else {
      toast.error(res.message);
      setLoaded(true);
    }

    return res;
  }, [router]);

  const sendRecoveryEmail = useCallback(
    async (values: z.infer<typeof zodSchema.auth.sendRecoveryEmail>) => {
      const res = await AuthApi.sendRecoveryEmail(values);
      if (res.success) router.push(ROUTE.VERIFY_RECOVERY);
      return res;
    },
    [router]
  );

  const changePassword = useCallback(
    async (values: z.infer<typeof zodSchema.auth.changePassword>) => {
      const res = await AuthApi.changePassword(values);
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
        sendRecoveryEmail,
        changePassword,
        changeAccount,
      }}
    >
      {loaded ? children : <LoadingPage />}
    </AuthContext.Provider>
  );
}
