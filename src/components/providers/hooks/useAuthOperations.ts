import type { UserInfo } from "api";

type TokenRef = {
  current: {
    accessToken: string;
    csrfToken: string;
  };
};

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { AuthApi } from "@/services";
import { ClientCookie } from "@/helpers/cookie";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";

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
    const { success: successCsrf, data: dataCsrf } = await AuthApi.getCsrf();
    if (successCsrf && dataCsrf) token.current.csrfToken = dataCsrf.csrfToken;

    const { success: successVerify, data: dataVerify } =
      await AuthApi.authenticate();
    setLogged(successVerify);

    const hasGuardCookie = ClientCookie.exists();

    if (successVerify && dataVerify) {
      setUser(dataVerify.user);
      token.current.accessToken = dataVerify.accessToken;
      document.cookie = ClientCookie.set(token.current.accessToken);
      if (!hasGuardCookie) {
        handlePageReload();
        return;
      }
    } else {
      document.cookie = ClientCookie.remove();
      if (hasGuardCookie) {
        handlePageReload();
        return;
      }
    }

    setLoaded(true);
  }, [setLogged, setLoaded, setUser, token, handlePageReload]);

  return {
    authenticate,
    handlePageReload,
  };
}
