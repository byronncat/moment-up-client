import { ROUTE } from "@/constants/clientConfig";
import { Metadata } from "@/constants/metadata";

import { cn } from "@/libraries/utils";
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
    <div className="flex flex-col border-x border-border h-full">
      <div
        className={cn(
          "sticky top-0 z-10 bg-card transform translate-x-[0.03125rem] "
        )}
      >
        <div
          className={cn(
            "flex justify-between items-center",
            "pt-7 pl-4 pr-2 pb-4"
          )}
        >
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings />
          </Button>
        </div>

        <NavigationBar items={tabs} />
      </div>

      <div className="overflow-y-auto">{children}</div>
    </div>
  );
}
