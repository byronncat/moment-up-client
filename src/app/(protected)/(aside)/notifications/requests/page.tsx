import { Suspense } from "react";
import { NotifyApi } from "@/services";
import { NotificationList, NotificationSkeleton } from "../_components";

export default function NotificationsPage() {
  const notificationRes = NotifyApi.getNotifications("requests");
  return (
    <Suspense
      fallback={
        <div className="pt-[121px]">
          <NotificationSkeleton />
        </div>
      }
    >
      <NotificationList type="requests" initialRes={notificationRes} />
    </Suspense>
  );
}
