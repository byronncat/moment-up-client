import type { UserInfo } from "api";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/services";
import { Cookie } from "@/utilities";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";

type TokenRef = {
  current: {
    accessToken: string;
    csrfToken: string;
  };
};

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

    const hasGuardCookie = Cookie.exists();

    if (successVerify && dataVerify) {
      setUser(dataVerify.user);
      token.current.accessToken = dataVerify.accessToken;
      document.cookie = Cookie.set();

      if (!hasGuardCookie) {
        handlePageReload();
        return;
      }
    } else {
      document.cookie = Cookie.remove();
      
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
