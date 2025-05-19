import { Metadata, type MetadataMap } from "@/constants/metadata";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { NavigationBar, type NavItem } from "@/components";
import { UserInformation } from "./_components";
import { Image, Heart, TableOfContents } from "lucide-react";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>;

export async function generateMetadata({ params }: LayoutProps) {
  const username = (await params).username;
  return (Metadata.profile as MetadataMap["profile"])(username);
}

export default async function Layout({ children, params }: LayoutProps) {
  const username = (await params).username;
  const tabs: NavItem[] = [
    {
      id: "moments",
      label: "Moments",
      icon: <TableOfContents />,
      href: ROUTE.PROFILE(username),
    },
    {
      id: "media",
      label: "Media",
      icon: <Image aria-label="User's media" />,
      href: ROUTE.PROFILE(username, "media"),
    },
    {
      id: "likes",
      label: "Likes",
      icon: <Heart />,
      href: ROUTE.PROFILE(username, "likes"),
    },
  ];

  return (
    <div className={cn("relative", "max-w-2xl mx-auto")}>
      <div className="pb-12">
        <div
          className={cn(
            "mb-4",
            "bg-card rounded-b-lg",
            "dark:border-b border-x border-border",
            "overflow-hidden shadow-sm"
          )}
        >
          <UserInformation username={username} />
          <NavigationBar
            items={tabs}
            className={cn("w-full", "border-t border-border border-b-0")}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
