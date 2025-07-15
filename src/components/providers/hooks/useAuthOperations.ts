import type { UserInfo } from "api";

type TokenRef = {
  current: {
    csrfToken: string;
  };
};

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { AuthApi } from "@/services";
import { ClientCookie } from "@/helpers/cookie";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";
import { AUTH_COOKIE_NAME } from "@/constants/serverConfig";

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
    const { success: successCsrf, data } = await AuthApi.getCsrf();
    if (successCsrf && data) token.current.csrfToken = data.csrfToken;

    const { success: successVerify, data: user } = await AuthApi.authenticate();
    setLogged(successVerify);

    const hasGuardCookie = authCookie.exists();

    if (successVerify && user) {
      setUser(user);
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
  }, [setLogged, setLoaded, setUser, token, handlePageReload, authCookie]);

  return {
    authenticate,
    handlePageReload,
  };
}
