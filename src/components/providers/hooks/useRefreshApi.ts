/* eslint-disable @typescript-eslint/no-explicit-any */

// === Types ====
import type { ErrorDto } from "api";

type AuthenticatedApiFunction<TArgs extends any[], TResult> = (
  ...args: [...TArgs, Token]
) => Promise<TResult>;

type ApiResult = {
  success: boolean;
  statusCode?: number;
  message: string;
};

interface Dependencies {
  _token?: Token;
  _refresh?: () => Promise<string>;
}

// === Hook ====
import { useCallback } from "react";
import { type Token, useAuth } from "../Auth";

const UNAUTHORIZED_STATUS_CODE = 401;

export function useRefreshApi<TArgs extends any[], TResult extends ApiResult>(
  apiFunction: AuthenticatedApiFunction<TArgs, TResult>,
  dependencies?: Dependencies
) {
  const { token, refresh } = useAuth();
  const currentToken = dependencies?._token ?? token;
  const currentRefresh = dependencies?._refresh ?? refresh;

  const executeWithRefresh = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      let result = await apiFunction(...args, currentToken);
      if (
        !result.success &&
        (result as unknown as ErrorDto).statusCode === UNAUTHORIZED_STATUS_CODE
      ) {
        const newAccessToken = await currentRefresh();
        result = await apiFunction(...args, {
          csrfToken: currentToken.csrfToken,
          accessToken: newAccessToken,
        });
      }

      return result;
    },
    [apiFunction, currentRefresh, currentToken]
  );

  return executeWithRefresh;
}
