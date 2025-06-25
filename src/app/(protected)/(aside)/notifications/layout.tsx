import { Metadata } from "@/constants/metadata";
import { ROUTE } from "@/constants/clientConfig";

import Link from "next/link";
import { PageHeader } from "../_components";
import { NavigationBar, type NavItem } from "@/components";
import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "@/components/icons";

const tabs: NavItem[] = [
  {
    id: "all",
    label: "All",
    icon: <Bell className="size-4" />,
    href: ROUTE.NOTIFICATION("all"),
  },
  {
    id: "requests",
    label: "Requests",
    icon: <User variant="plus" className="size-4" />,
    href: ROUTE.NOTIFICATION("requests"),
  },
  {
    id: "social",
    label: "Social",
    icon: <User multiple className="size-4" />,
    href: ROUTE.NOTIFICATION("social"),
  },
];

export const metadata = Metadata.notifications;
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
      {children}
    </div>
  );
}
