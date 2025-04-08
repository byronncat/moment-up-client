"use client";

import { set, type z } from "zod";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";

import { auth } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { LoadingPage } from "../pages";
import { loginFormSchema, signupFormSchema } from "@/lib/zodSchema";
import { AUTH_ROUTES, PROTECTED_ROUTES, ROUTE } from "@/constants/serverConfig";

const AuthContext = createContext(
  {} as {
    logged?: boolean;
    setLogged: (logged: boolean) => void;
    loaded: boolean;
    setLoaded: (loaded: boolean) => void;
    authenticate: () => Promise<void>;
    login: (values: z.infer<typeof loginFormSchema>) => Promise<void>;
    signup: (values: z.infer<typeof signupFormSchema>) => Promise<void>;
    logout: () => Promise<void>;
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
  const { toast } = useToast();
  const [logged, setLogged] = useState<boolean>();
  const [loaded, setLoaded] = useState(false);

  const authenticate = useCallback(async () => {
    const { success } = await auth.verify();
    setLogged(success);
    setLoaded(true);
  }, []);

  const login = useCallback(
    async (values: z.infer<typeof loginFormSchema>) => {
      const { success, message } = await auth.login(values);
      if (!success)
        toast({
          title: "Login failed",
          description: message,
          variant: "destructive",
        });
      else {
        setLogged(true);
        router.push(ROUTE.HOME);
      }
    },
    [toast, router]
  );

  const signup = useCallback(
    async (values: z.infer<typeof signupFormSchema>) => {
      const { success, message } = await auth.signup(values);
      if (!success)
        toast({
          title: "Signup failed",
          description: message,
          variant: "destructive",
        });
      else {
        setLogged(true);
        router.push(ROUTE.HOME);
      }
    },
    [toast, router]
  );

  const logout = useCallback(async () => {
    setLoaded(false);
    const { success, message } = await auth.logout();
    if (!success)
      toast({
        title: "Logout failed",
        description: message,
        variant: "destructive",
      });
    else {
      setLogged(false);
      router.push(ROUTE.LOGIN);
    }

    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, [toast, router]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  useEffect(() => {
    if (loaded) {
      if (logged && AUTH_ROUTES.includes(pathname)) {
        router.replace(ROUTE.HOME);
      } else if (!logged && PROTECTED_ROUTES.includes(pathname)) {
        router.replace(ROUTE.LOGIN);
      }
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
      }}
    >
      {loaded ? children : <LoadingPage />}
    </AuthContext.Provider>
  );
}
