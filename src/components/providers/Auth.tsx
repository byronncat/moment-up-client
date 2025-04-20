"use client";

import type { z } from "zod";
import type { API } from "api";

import { useRouter, usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import zodSchema from "@/lib/zodSchema";
import { auth } from "@/services";
import { LoadingPage } from "../pages";
import { AUTH_ROUTES, PROTECTED_ROUTES, ROUTE } from "@/constants/clientConfig";

const AuthContext = createContext(
  {} as {
    logged?: boolean;
    setLogged: (logged: boolean) => void;
    loaded: boolean;
    setLoaded: (loaded: boolean) => void;
    authenticate: () => Promise<void>;
    login: (values: z.infer<typeof zodSchema.login>) => Promise<API>;
    signup: (values: z.infer<typeof zodSchema.signup>) => Promise<API>;
    logout: () => Promise<void>;
    sendRecoveryEmail: (
      values: z.infer<typeof zodSchema.sendRecoveryEmail>
    ) => Promise<API>;
    changePassword: (
      values: z.infer<typeof zodSchema.changePassword>
    ) => Promise<API>;
  }
);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [logged, setLogged] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const authenticate = useCallback(async () => {
    const { success } = await auth.verify();
    setLogged(success);
    setLoaded(true);
  }, []);

  const login = useCallback(
    async (values: z.infer<typeof zodSchema.login>) => {
      const res = await auth.login(values);
      if (res.success) {
        setLogged(true);
        router.push(ROUTE.HOME);
      }
      return res;
    },
    [router]
  );

  const signup = useCallback(
    async (values: z.infer<typeof zodSchema.signup>) => {
      const res = await auth.signup(values);
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
    const { success, message } = await auth.logout();
    if (success) {
      setLogged(false);
      router.push(ROUTE.LOGIN);
    }

    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, [router]);

  const sendRecoveryEmail = useCallback(
    async (values: z.infer<typeof zodSchema.sendRecoveryEmail>) => {
      const res = await auth.sendRecoveryEmail(values);
      if (res.success) router.push(ROUTE.VERIFY_RECOVERY);
      return res;
    },
    [router]
  );

  const changePassword = useCallback(
    async (values: z.infer<typeof zodSchema.changePassword>) => {
      const res = await auth.changePassword(values);
      if (res.success) router.push(ROUTE.LOGIN);
      return res;
    },
    [router]
  );

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  useEffect(() => {
    if (loaded) {
      if (logged && AUTH_ROUTES.includes(pathname)) router.replace(ROUTE.HOME);
      else if (!logged && PROTECTED_ROUTES.includes(pathname))
        router.replace(ROUTE.LOGIN);
    }
  }, [logged, loaded, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        logged,
        setLogged,
        loaded,
        setLoaded,
        authenticate,
        login,
        signup,
        logout,
        sendRecoveryEmail,
        changePassword,
      }}
    >
      {loaded ? children : <LoadingPage />}
    </AuthContext.Provider>
  );
}
