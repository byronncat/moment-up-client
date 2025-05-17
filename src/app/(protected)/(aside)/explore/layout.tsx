import { Metadata } from "@/constants/metadata";
import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";
import { Image, Users } from "lucide-react";
import NavigationBar, {
  type NavItem,
} from "@/components/HorizontalNavigationBar";

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
    <div className={cn("flex flex-col h-full", "pt-0 sm:pt-2 pb-10")}>
      <NavigationBar items={tabs} className="mb-8" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
