import { mockNotifications } from "@/__mocks__";
import type { API, NotificationInfo } from "api";

export const getNotifications = async (
  type: "all" | "requests" | "social" = "all",
  page: number = 0
): Promise<
  API<{
    items: NotificationInfo[];
    hasNextPage: boolean;
  }>
> => {
  console.log("getNotifications", type, page);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const filteredNotifications = mockNotifications.filter((notification) => {
    if (type === "all") return true;
    if (type === "requests")
      return (
        notification.type === "social" &&
        notification.information.type === "follow"
      );
    if (type === "social")
      return (
        notification.type === "social" &&
        notification.information.type !== "follow"
      );
  });

  // Generate unique notifications by duplicating and modifying IDs
  const generateUniqueNotifications = (count: number) => {
    const uniqueNotifications: NotificationInfo[] = [];

    for (let i = 0; i < count; i++) {
      const notification =
        filteredNotifications[i % filteredNotifications.length];
      uniqueNotifications.push({
        ...notification,
        id: `${notification.id}-${i}-${page}`, // Make each ID unique
        // Also update nested user ID if it exists to maintain consistency
        ...(notification.type === "social" &&
          notification.user && {
            user: {
              ...notification.user,
              id: `${notification.user.id}-${i}`,
            },
          }),
      });
    }

    return uniqueNotifications;
  };

  return {
    success: true,
    message: "Notifications fetched successfully",
    data: {
      items: generateUniqueNotifications(10),
      hasNextPage: page < 2,
    }, // Generate 200 unique notifications
  };
};
