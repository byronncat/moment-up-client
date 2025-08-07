import { NotifyApi } from "@/services";
import { NotificationList } from "../_components";

export default function NotificationPage() {
  const notificationRes = NotifyApi.getNotifications();
  return <NotificationList type="all" initialRes={notificationRes} />;
}
