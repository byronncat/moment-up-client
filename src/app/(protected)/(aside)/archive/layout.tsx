import { Metadata } from "@/constants/metadata";
import { ROUTE } from "@/constants/clientConfig";
import { cn } from "@/libraries/utils";
import { PageHeader } from "../_components";
import { NavigationBar, type NavItem } from "@/components";
import { Bookmark, Heart } from "@/components/icons";

const tabs: NavItem[] = [
  {
    id: "saved",
    icon: <Bookmark className="size-5" />,
    label: "Saved",
    href: ROUTE.ARCHIVE("bookmarks"),
  },
  {
    id: "liked",
    icon: <Heart className="size-5" />,
    label: "Liked",
    href: ROUTE.ARCHIVE("likes"),
  },
];

export const metadata = Metadata.explore;
export default function ArchiveLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative">
        <PageHeader
          title="Archive"
          className={cn("w-full", "absolute top-0 left-0 z-10")}
        >
          <NavigationBar items={tabs} />
        </PageHeader>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
