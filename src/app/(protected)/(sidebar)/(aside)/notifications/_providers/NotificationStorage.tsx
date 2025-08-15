"use client";

import type { NotificationInfo, PaginationInfo } from "api";

import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useAuth, useRefreshSWR } from "@/components/providers/Auth";
import { ApiUrl } from "@/services";
import { INITIAL_PAGE, NotificationType } from "@/constants/serverConfig";

import { ErrorContent, NoContent } from "@/components/common";
import { NotificationSkeleton } from "../_components";
import { Bell } from "@/components/icons";

type NotificationContextType = {
  notifications: NotificationInfo[];
  hasNextPage: boolean;
  isLoading: boolean;
  setNotifications: (notifications: NotificationInfo[]) => void;
  loadNextPage: () => void;
};

const NotificationContext = createContext<NotificationContextType>({} as any);

export const useNotification = () => useContext(NotificationContext);
const NOTIFICATIONS_PER_PAGE = 12;

type NotificationStorageProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const getNotificationType = (
  pathname: string
): "all" | "request" | "social" => {
  const segments = pathname.split("/");
  const typeSegment = segments[segments.length - 1];

  if (typeSegment === "" || typeSegment === "notifications")
    return NotificationType.ALL;
  if (typeSegment === "request" || typeSegment === "social") return typeSegment;
  return NotificationType.ALL;
};

export default function NotificationStorageProvider({
  children,
}: NotificationStorageProviderProps) {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();

  const pathname = usePathname();

  const type = getNotificationType(pathname);

  const getKey = (
    pageIndex: number,
    previousPageData: PaginationInfo<NotificationInfo> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;

    const url = ApiUrl.notification.get(
      type,
      pageIndex + 1,
      NOTIFICATIONS_PER_PAGE
    );
    return [url, token.accessToken];
  };

  const { data, error, size, setSize, isLoading, isValidating } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationInfo<NotificationInfo>>(
          url,
          accessToken
        ),
      {
        initialSize: INITIAL_PAGE,
        revalidateFirstPage: false,
        errorRetryCount: 0,
        revalidateOnFocus: false,
      }
    );

  const [notifications, setNotifications] = useState<
    NotificationInfo[] | undefined
  >(undefined);
  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : true;

  useEffect(() => {
    const notifications = data
      ? data.flatMap((page) => page?.items || [])
      : undefined;
    if (notifications) setNotifications(notifications);
  }, [data]);

  async function loadNextPage() {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }

  function refetch() {
    setSize(INITIAL_PAGE);
  }

  if (isLoading)
    return (
      <Wrapper>
        <NotificationSkeleton />
      </Wrapper>
    );
  if (error || !notifications)
    return (
      <Wrapper>
        <ErrorContent onRefresh={refetch} className="pt-24" />
      </Wrapper>
    );
  if (notifications.length === 0)
    return (
      <Wrapper>
        <NoContent
          icon={<Bell className="size-16 text-muted-foreground" />}
          title="No notifications"
          description="When you have notifications, they'll show up here."
          className="pt-24"
        />
      </Wrapper>
    );
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        hasNextPage,
        isLoading: isValidating,
        setNotifications,
        loadNextPage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="pt-[121px]">{children}</div>;
}
