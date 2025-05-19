import { mockNotifications } from "@/__mocks__";
import type { API, Notification } from "api";


export const getNotifications = async (type: "all" | "requests" | "information" = "all"): Promise<API<Notification[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const filteredNotifications = mockNotifications.filter((notification) => {
    if (type === "all") return true;
    if (type === "requests") return notification.type === "community" && notification.information.type === "follow";
    if (type === "information") return notification.type === "community" && notification.information.type !== "follow";
  });
  return {
    success: true,
    message: "Notifications fetched successfully",
    data: filteredNotifications,
  }
};

