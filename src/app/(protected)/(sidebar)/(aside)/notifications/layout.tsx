import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.notifications;

import Link from "next/link";
import NotificationStorageProvider from "./_providers/NotificationStorage";
import { PageHeader } from "../_components";
import { NavigationBar, type NavItem } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "@/components/icons";
import { ROUTE } from "@/constants/route";
import { NotificationType } from "@/constants/serverConfig";

const tabs: NavItem[] = [
  {
    id: NotificationType.ALL,
    label: "All",
    icon: <Bell className="size-4" />,
    href: ROUTE.NOTIFICATION(NotificationType.ALL),
  },
  {
    id: NotificationType.REQUEST,
    label: "Requests",
    icon: <User variant="plus" className="size-4" />,
    href: ROUTE.NOTIFICATION(NotificationType.REQUEST),
  },
  {
    id: NotificationType.SOCIAL,
    label: "Social",
    icon: <User multiple className="size-4" />,
    href: ROUTE.NOTIFICATION(NotificationType.SOCIAL),
  },
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="size-full">
      <div className="relative">
        <PageHeader
          title="Notifications"
          className="absolute top-0 z-10 w-full"
          sideButton={
            <Link href={ROUTE.SETTINGS}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="size-5 text-muted-foreground" />
              </Button>
            </Link>
          }
        >
          <NavigationBar items={tabs} />
        </PageHeader>
      </div>
      <NotificationStorageProvider>{children}</NotificationStorageProvider>
    </div>
  );
}
