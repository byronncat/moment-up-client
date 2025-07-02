import { Metadata } from "@/constants/metadata";
import { ROUTE } from "@/constants/route";
import { cn } from "@/libraries/utils";
import { PageHeader } from "../_components";
import { NavigationBar, type NavItem } from "@/components/common";
import { Image, User } from "@/components/icons";

const tabs: NavItem[] = [
  {
    id: "media",
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image className="size-5" />,
    label: "Media",
    href: ROUTE.EXPLORE("media"),
  },
  {
    id: "moments",
    icon: <User multiple className="size-5" />,
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
        <PageHeader
          title="Explore"
          className={cn("w-full", "absolute top-0 left-0 z-10")}
        >
          <NavigationBar items={tabs} />
        </PageHeader>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
