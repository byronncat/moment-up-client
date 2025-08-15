"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useNotification } from "../_providers/NotificationStorage";
import { HEADER_HEIGHT } from "../../_constants/spacing";
import VirtualizedList from "./VirtualizedList";

export default function NotificationList() {
  const { isMobile } = useSidebar();
  const { notifications, loadNextPage, hasNextPage, isLoading } =
    useNotification();

  return (
    <VirtualizedList
      items={notifications}
      hasNextPage={hasNextPage}
      isNextPageLoading={isLoading}
      loadNextPage={loadNextPage}
      listOptions={{
        topPadding: 121 - (isMobile ? HEADER_HEIGHT : 0),
        bottomPadding: 48,
      }}
    />
  );
}
