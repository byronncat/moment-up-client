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

interface Dependencies {
  _token?: Token;
  _refresh?: () => Promise<string>;
}

import { useCallback } from "react";
import { useAuth } from "../Auth";

const UNAUTHORIZED_STATUS_CODE = 401;

export function useRefreshApi<TArgs extends any[], TResult extends ApiResult>(
  apiFunction: AuthenticatedApiFunction<TArgs, TResult>,
  dependencies?: Dependencies
) {
  const { token, refresh } = useAuth();
  const currentToken = dependencies?._token || token;
  const currentRefresh = dependencies?._refresh || refresh;

  const executeWithRefresh = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      let result = await apiFunction(...args, currentToken);
      if (
        !result.success &&
        (result as unknown as ErrorResponse).statusCode ===
          UNAUTHORIZED_STATUS_CODE
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
