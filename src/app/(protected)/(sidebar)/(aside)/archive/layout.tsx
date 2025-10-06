import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.archive;

import { ROUTE } from "@/constants/route";
import { cn } from "@/libraries/utils";
import { PageHeader } from "../_components";
import { NavigationBar, type NavItem } from "@/components/common";
import { Bookmark, Heart } from "@/components/icons";

const tabs: NavItem[] = [
  {
    id: "bookmarks",
    icon: <Bookmark className="size-5" />,
    label: "Bookmarks",
    href: ROUTE.ARCHIVE("bookmarks"),
  },
  {
    id: "likes",
    icon: <Heart className="size-5" />,
    label: "Likes",
    href: ROUTE.ARCHIVE("likes"),
  },
];

export default function ArchiveLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <PageHeader
        title="Archive"
        className={cn("w-full", "sticky top-0 left-0 z-10")}
      >
        <NavigationBar items={tabs} />
      </PageHeader>
      <main className="flex-1">{children}</main>
    </div>
  );
}
