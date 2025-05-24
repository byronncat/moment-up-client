import { Metadata } from "@/constants/metadata";
import { ROUTE } from "@/constants/clientConfig";

import { ListLayout, PageHeader } from "../_components";
import { NavigationBar, type NavItem } from "@/components";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const tabs: NavItem[] = [
  {
    id: "all",
    label: "All",
    href: ROUTE.NOTIFICATION("all"),
  },
  {
    id: "requests",
    label: "Requests",
    href: ROUTE.NOTIFICATION("requests"),
  },
  {
    id: "information",
    label: "Information",
    href: ROUTE.NOTIFICATION("information"),
  },
];

export const metadata = Metadata.notifications;
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ListLayout>
      <PageHeader
        title="Notifications"
        sideButton={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="size-5 text-muted-foreground" />
          </Button>
        }
      >
        <NavigationBar items={tabs} />
      </PageHeader>
      <div className="overflow-y-auto">{children}</div>
    </ListLayout>
  );
}
