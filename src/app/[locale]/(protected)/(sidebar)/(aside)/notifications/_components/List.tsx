"use client";

import type { NotificationDto } from "api";
import { useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useNotification } from "../../../../../../../components/providers/NotificationStorage";
import { NotificationType } from "@/constants/server";

import { ErrorContent, NoContent } from "@/components/common";
import NotificationItem from "./item";
import { NotificationItemSkeleton } from "./Skeleton";
import { Bell } from "lucide-react";

const NOTIFICATION_HEIGHT = 80;

export default function NotificationList() {
  "use no memo";
  const { notifications, error, hasNextPage, isLoading, loadNextPage, mutate } =
    useNotification();

  const itemCount = notifications
    ? notifications.length === 0 || error
      ? 1
      : notifications.length + (hasNextPage ? 1 : 0)
    : 1;

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    estimateSize: () => NOTIFICATION_HEIGHT,
    measureElement: (element) => element.getBoundingClientRect().height,
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!notifications?.length) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (lastItem.index >= itemCount - 2 && hasNextPage && !isLoading)
      loadNextPage();
  }, [
    notifications?.length,
    hasNextPage,
    isLoading,
    itemCount,
    virtualItems,
    loadNextPage,
  ]);

  function onItemClick(_item: NotificationDto) {
    if (_item.type === NotificationType.FOLLOW_REQUEST) {
      mutate();
      return;
    }
  }

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
      }}
    >
      {virtualItems.map((vItem) => {
        const isLoaderRow = hasNextPage && vItem.index === itemCount - 1;
        const notification = notifications?.[vItem.index];
        return (
          <div
            key={vItem.key}
            data-index={vItem.index}
            ref={(element) => virtualizer.measureElement(element)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${vItem.start}px)`,
            }}
          >
            {isLoading ? (
              <NotificationItemSkeleton />
            ) : error ? (
              <ErrorContent onRefresh={mutate} className="py-20" />
            ) : notifications === undefined ? null : notifications.length ===
              0 ? (
              <NoContent
                icon={<Bell className="size-14 text-muted-foreground" />}
                title="No notifications"
                description="When you have notifications, they'll show up here."
                className="py-20"
              />
            ) : isLoaderRow ? (
              <NotificationItemSkeleton />
            ) : notification ? (
              <NotificationItem
                notification={notification}
                onClick={() => onItemClick(notification)}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
