"use client";

import { useAuth } from "@/components/providers";
import { ROUTE } from "@/constants/route";
import { ExploreType } from "@/constants/server";

import { cn } from "@/libraries/utils";
import { PageHeader, PublicHeader } from "../../_components";
import { type NavItem, NavigationBar } from "@/components/common";
import { Image as ImageIcon, User } from "@/components/icons";

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

export default function Header({ title }: Readonly<{ title: string }>) {
  const { user } = useAuth();

  return user ? (
    <PageHeader
      title={title}
      className={cn("w-full", "sticky top-[52px] mobile:top-0 left-0 z-10")}
    >
      <NavigationBar items={tabs} />
    </PageHeader>
  ) : (
    <div
      className={cn(
        "bg-background/90 backdrop-blur-md",
        "w-full",
        "sticky top-0 left-0 z-10"
      )}
    >
      <div className={cn("hidden xl:block", "pt-5 pl-4 pb-4", "relative")}>
        <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
      </div>

      <PublicHeader title="MomentUp" borderBottom={false} />
      <NavigationBar items={tabs} />
    </div>
  );
}
