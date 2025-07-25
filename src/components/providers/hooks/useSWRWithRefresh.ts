import { useCallback } from "react";
import { useAuth } from "../Auth";
import type { ErrorResponse } from "api";

export function useRefreshSWR() {
  const { refresh } = useAuth();

  const swrFetcherWithRefresh = useCallback(
    async <T = void>(url: string, _token: string): Promise<T | undefined> => {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${_token}`,
        },
        credentials: "include",
      });

      if (!response.ok && response.status === 401) {
        const newAccessToken = await refresh();

        response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newAccessToken}`,
          },
          credentials: "include",
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error((error as ErrorResponse).message as string);
      }

      return await response.json();
    },
    [refresh]
  );

  return swrFetcherWithRefresh;
}
