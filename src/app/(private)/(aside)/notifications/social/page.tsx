import { NotifyApi } from "@/services";
import { NotificationList } from "../_components";

export default function NotificationPage() {
  const notificationRes = NotifyApi.getNotifications("social");
  return <NotificationList type="social" initialRes={notificationRes} />;
}
