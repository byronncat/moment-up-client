import { Suspense } from "react";
import { NotifyApi } from "@/services";
import { NotificationList, NotificationSkeleton } from "../_components";

export default function NotificationsPage() {
  const notificationRes = NotifyApi.getNotifications();
  return (
    <Suspense
      fallback={
        <div className="pt-[125px]">
          <NotificationSkeleton />
        </div>
      }
    >
      <NotificationList type="all" initialRes={notificationRes} />
    </Suspense>
  );
}
