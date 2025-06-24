import { Suspense } from "react";
import { NotifyApi } from "@/services";
import { NotificationList, NotificationSkeleton } from "../_components";

export default function NotificationsPage() {
  const notificationRes = NotifyApi.getNotifications("social");
  return (
    <Suspense fallback={<div className="pt-[125px]"><NotificationSkeleton /></div>}>
      <NotificationList type="social" initialRes={notificationRes} />
    </Suspense>
  );
}
  