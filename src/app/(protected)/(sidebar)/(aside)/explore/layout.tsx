import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.explore;

import { cn } from "@/libraries/utils";
import { PageHeader } from "../_components";
import { type NavItem, NavigationBar } from "@/components/common";
import { Image as ImageIcon, User } from "@/components/icons";
import { ROUTE } from "@/constants/route";
import { ExploreType } from "@/constants/server";

const tabs: NavItem[] = [
  {
    id: ExploreType.POST,
    icon: <User multiple className="size-5" />,
    label: "Posts",
    href: ROUTE.EXPLORE(ExploreType.POST),
  },
  {
    id: ExploreType.MEDIA,
    icon: <ImageIcon className="size-5" />,
    label: "Media",
    href: ROUTE.EXPLORE(ExploreType.MEDIA),
  },
];

export default function ExploreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <PageHeader
        title="Explore"
        className={cn("w-full", "sticky top-[52px] mobile:top-0 left-0 z-10")}
      >
        <NavigationBar items={tabs} />
      </PageHeader>
      <main className="flex-1">{children}</main>
    </div>
  );
}
