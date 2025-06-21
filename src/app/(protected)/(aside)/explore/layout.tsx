import { Metadata } from "@/constants/metadata";
import { ROUTE } from "@/constants/clientConfig";
import { cn } from "@/libraries/utils";
import { NavigationBar, type NavItem } from "@/components";
import { Image, Users } from "lucide-react";

const tabs: NavItem[] = [
  {
    id: "media",
    icon: <Image aria-label="Media" />,
    label: "Media",
    href: ROUTE.EXPLORE("media"),
  },
  {
    id: "moments",
    icon: <Users />,
    label: "Moments",
    href: ROUTE.EXPLORE("moments"),
  },
];

export const metadata = Metadata.explore;
export default function ExploreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative">
        <NavigationBar
          items={tabs}
          className={cn(
            "absolute top-0 left-0 z-10",
            "bg-background/90 backdrop-blur-sm"
          )}
        />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
