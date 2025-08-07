import { NotifyApi } from "@/services";
import { NotificationList } from "../_components";

export default function NotificationPage() {
  const notificationRes = NotifyApi.getNotifications("requests");
  return <NotificationList type="requests" initialRes={notificationRes} />;
}
