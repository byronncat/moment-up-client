"use client";

import type { z } from "zod";
import type { API, UserCardDisplayInfo } from "api";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import zodSchema from "@/libraries/zodSchema";
import { AuthApi } from "@/services";
import { LoadingPage } from "../pages";
import { ROUTE } from "@/constants/clientConfig";

type User = Omit<UserCardDisplayInfo, "followedBy" | "isFollowing">;
type AuthContextType = {
  user: User | null;
  logged?: boolean;
  loaded: boolean;
  setLogged: (logged: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  authenticate: () => Promise<void>;
  login: (values: z.infer<typeof zodSchema.auth.login>) => Promise<API>;
  switchLogin: (values: z.infer<typeof zodSchema.auth.login>) => Promise<API>;
  signup: (values: z.infer<typeof zodSchema.auth.signup>) => Promise<API>;
  logout: () => Promise<API>;
  sendRecoveryEmail: (
    values: z.infer<typeof zodSchema.auth.sendRecoveryEmail>
  ) => Promise<API>;
  changePassword: (
    values: z.infer<typeof zodSchema.auth.changePassword>
  ) => Promise<API>;
  changeAccount: (accountId: UserCardDisplayInfo["id"]) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  logged: false,
  loaded: false,
  setLogged: () => {},
  setLoaded: () => {},
  authenticate: async () => {},
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

  const authenticate = useCallback(async () => {
    const { success, data } = await AuthApi.verify();
    if (success && data) setUser(data);
    setLogged(success);
    setLoaded(true);
  }, []);

  const login = useCallback(
    async (values: z.infer<typeof zodSchema.auth.login>) => {
      const res = await AuthApi.login(values);
      if (res.success) {
        setLogged(true);
        router.push(ROUTE.HOME);
      }
      return res;
    },
    [router]
  );

  const switchLogin = useCallback(
    async (values: z.infer<typeof zodSchema.auth.login>) => {
      setLoaded(false);
      const res = await AuthApi.login(values);
      if (res.success) {
        router.refresh();
        router.push(ROUTE.HOME);
      }

      setTimeout(() => {
        setLoaded(true);
      }, PAGE_RELOAD_TIME); // Wait for the page to reload
      return res;
    },
    [router]
  );

  const signup = useCallback(
    async (values: z.infer<typeof zodSchema.auth.signup>) => {
      const res = await AuthApi.signup(values);
      if (res.success) {
        setLogged(true);
        router.push(ROUTE.HOME);
      }
      return res;
    },
    [router]
  );

  const logout = useCallback(async () => {
    setLoaded(false);
    const res = await AuthApi.logout();
    if (res.success) {
      setLogged(false);
      router.push(ROUTE.LOGIN);
    }
    setTimeout(() => {
      setLoaded(true);
    }, PAGE_RELOAD_TIME);

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
        setLogged,
        loaded,
        setLoaded,
        authenticate,
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
