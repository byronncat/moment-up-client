"use client";

import type { Notification } from "api";
import { useEffect, useState } from "react";
import { NotifyApi } from "@/services";
import { NotificationItem } from "../_components";
import { Loader2 } from "lucide-react";

export default function NotificationsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );

  useEffect(() => {
    async function fetchNotifications() {
      const res = await NotifyApi.getNotifications("all");
      if (res.success) setNotifications(res.data ?? []);
      setIsLoaded(true);
    }

    fetchNotifications();
  }, []);

  return (
    <div className="flex flex-col">
      {isLoaded ? (
        notifications?.map((notification) => (
          <NotificationItem key={notification.id} data={notification} />
        ))
      ) : (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
