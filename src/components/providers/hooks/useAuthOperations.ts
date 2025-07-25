import type { UserInfo } from "api";
import type { Token } from "../Auth";

interface TokenRef {
  current: Token;
}

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { AuthApi } from "@/services";
import ClientCookie from "@/helpers/client-cookie";
import { PAGE_RELOAD_TIME, AUTH_COOKIE_NAME } from "@/constants/clientConfig";

type AuthHookProps = {
  setLogged: (logged: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setUser: (user: UserInfo | null) => void;
  token: TokenRef;
};

export function useAuthOperations({
  setLogged,
  setLoaded,
  setUser,
  token,
}: AuthHookProps) {
  const router = useRouter();
  const authCookie = useMemo(() => ClientCookie(AUTH_COOKIE_NAME), []);

  const handlePageReload = useCallback(
    (callback?: () => void) => {
      router.refresh();
      setTimeout(() => {
        setLoaded(true);
        callback?.();
      }, PAGE_RELOAD_TIME);
    },
    [router, setLoaded]
  );

  const authenticate = useCallback(async () => {
    const csrfToken = await AuthApi.csrf();
    token.current.csrfToken = csrfToken;

    const accessToken = await AuthApi.refresh();
    token.current.accessToken = accessToken;

    const { success, data } = await AuthApi.getUser(token.current.accessToken);
    setLogged(success);

    const hasGuardCookie = authCookie.exists();

    if (success && data) {
      setUser(data.user);
      document.cookie = authCookie.set();
      if (!hasGuardCookie) {
        handlePageReload();
        return;
      }
    } else {
      document.cookie = authCookie.remove();
      if (hasGuardCookie) {
        handlePageReload();
        return;
      }
    }

    setLoaded(true);
  }, [handlePageReload, authCookie, setLogged, setLoaded, setUser, token]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);
}
