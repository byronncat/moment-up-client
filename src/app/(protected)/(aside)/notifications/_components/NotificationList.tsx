"use client";

import type { API, NotificationInfo } from "api";
import { use, useEffect, useRef, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { NotifyApi } from "@/services";
import { HEADER_HEIGHT } from "../../_components";
import VirtualizedList from "./VirtualizedList";

type NotificationListProps = Readonly<{
  type: "all" | "requests" | "social";
  initialRes: Promise<
    API<{
      items: NotificationInfo[];
      hasNextPage: boolean;
    }>
  >;
}>;

export default function NotificationList({
  type,
  initialRes,
}: NotificationListProps) {
  const response = use(initialRes);
  const [notifications, setNotifications] = useState(
    response.data?.items ?? []
  );
  const [hasNextPage, setHasNextPage] = useState(
    response?.data?.hasNextPage ?? true
  );
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const { isMobile } = useSidebar();
  const pageRef = useRef(1);

  async function fetchNotifications(page?: number) {
    const { success, data } = await NotifyApi.getNotifications(
      type,
      page ?? pageRef.current + 1
    );
    if (success) {
      setNotifications((prev) => [...prev, ...(data?.items ?? [])]);
      setHasNextPage(data?.hasNextPage ?? false);
      pageRef.current = page ?? pageRef.current + 1;
    } else setHasNextPage(false);
    setIsNextPageLoading(false);
  }

  useEffect(() => {
    setNotifications(response.data?.items ?? []);
  }, [response]);

  if (!notifications) return null;
  return (
    <VirtualizedList
      items={notifications}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={fetchNotifications}
      listOptions={{
        topPadding: 121 - (isMobile ? HEADER_HEIGHT : 0),
        bottomPadding: 48,
      }}
    />
  );
}
