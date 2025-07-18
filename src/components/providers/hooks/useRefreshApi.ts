import type { ErrorResponse } from "api";
import type { Token } from "../Auth";

type AuthenticatedApiFunction<TArgs extends any[], TResult> = (
  ...args: [...TArgs, Token]
) => Promise<TResult>;

type ApiResult = {
  success: boolean;
  statusCode?: number;
  message: string;
  [key: string]: any;
};

import { useCallback } from "react";
import { useAuth } from "../Auth";

export function useRefreshApi<TArgs extends any[], TResult extends ApiResult>(
  apiFunction: AuthenticatedApiFunction<TArgs, TResult>
) {
  const { token, refresh } = useAuth();

  const executeWithRefresh = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      let result = await apiFunction(...args, {
        csrfToken: token.csrfToken,
        accessToken: token.accessToken,
      });

      if (
        !result.success &&
        (result as unknown as ErrorResponse).statusCode === 401
      ) {
        const newAccessToken = await refresh();

        result = await apiFunction(...args, {
          csrfToken: token.csrfToken,
          accessToken: newAccessToken,
        });
      }

      return result;
    },
    [apiFunction, token, refresh]
  );

  return executeWithRefresh;
}
