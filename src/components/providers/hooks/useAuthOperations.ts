import type { AccountDto } from "api";
import type { Token } from "../Auth";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { AuthApi } from "@/services";
import ClientCookie from "@/helpers/client-cookie";
import { CookieName, PAGE_RELOAD_TIME } from "@/constants/client";
import { ROUTE } from "@/constants/route";

interface AuthHookProps {
  setLogged: (logged: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setUser: (user: AccountDto | null) => void;

  token: {
    current: Token;
  };
}

export function useAuthOperations({
  setLogged,
  setLoaded,
  setUser,
  token,
}: AuthHookProps) {
  const router = useRouter();
  const authCookie = useMemo(() => ClientCookie(CookieName.AUTH_GUARD), []);

  const handlePageReload = useCallback(
    (callback?: () => void) => {
      callback?.();
      setTimeout(() => {
        setLoaded(true);
      }, PAGE_RELOAD_TIME);
    },
    [setLoaded]
  );

  const authenticate = useCallback(async () => {
    const csrfToken = await AuthApi.csrf();
    token.current.csrfToken = csrfToken;

    const accessToken = await AuthApi.refresh();
    token.current.accessToken = accessToken;

    const hasGuardCookie = authCookie.exists();

    if (accessToken) {
      const { success, data } = await AuthApi.getUser(
        token.current.accessToken
      );
      setLogged(success);

      if (success && data) {
        setUser(data.user);
        document.cookie = authCookie.set();
        if (!hasGuardCookie) {
          handlePageReload(() => router.push(ROUTE.HOME));
          return;
        }
      }
    } else {
      document.cookie = authCookie.remove();
      if (hasGuardCookie) {
        handlePageReload(() => router.push(ROUTE.LOGIN));
        return;
      }
    }

    setLoaded(true);
  }, [
    router,
    authCookie,
    handlePageReload,
    setLogged,
    setLoaded,
    setUser,
    token,
  ]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);
}
