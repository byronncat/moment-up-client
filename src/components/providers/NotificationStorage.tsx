"use client";

import type { ErrorDto, NotificationDto, PaginationDto } from "api";

type NotificationContextType = {
  notifications: NotificationDto[] | undefined;
  error: ErrorDto | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  loadNextPage: () => void;
  mutate: () => void;
};

// === Provider ===
import { createContext, use } from "react";
import useSWRInfinite from "swr/infinite";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { SWRInfiniteOptions } from "@/helpers/swr";
import { ApiUrl } from "@/services";

const NotificationContext = createContext<NotificationContextType>({
  notifications: undefined,
  error: undefined,
  isLoading: false,
  hasNextPage: false,
  loadNextPage: () => {},
  mutate: () => {},
});

export const useNotification = () => use(NotificationContext);

type NotificationStorageProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function NotificationStorageProvider({
  children,
}: NotificationStorageProviderProps) {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationDto<NotificationDto> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.notification.get(pageIndex + 1);
    return [url, token.accessToken];
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationDto<NotificationDto>>(url, accessToken),
      SWRInfiniteOptions
    );

  const notifications = data?.flatMap((page) => page?.items);

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : true;

  async function loadNextPage() {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        error,
        isLoading,
        hasNextPage,
        loadNextPage,
        mutate,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
