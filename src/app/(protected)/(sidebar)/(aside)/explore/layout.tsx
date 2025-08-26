import { Metadata } from "@/constants/metadata";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { PageHeader } from "../_components";
import { NavigationBar, type NavItem } from "@/components/common";
import { Image as ImageIcon, User } from "@/components/icons";
import { ExploreType } from "@/constants/serverConfig";

const tabs: NavItem[] = [
  {
    id: ExploreType.MEDIA,
    icon: <ImageIcon className="size-5" />,
    label: "Media",
    href: ROUTE.EXPLORE(ExploreType.MEDIA),
  },
  {
    id: ExploreType.POST,
    icon: <User multiple className="size-5" />,
    label: "Moments",
    href: ROUTE.EXPLORE(ExploreType.POST),
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
      <main className="flex-1">{children}</main>
    </div>
  );
}
