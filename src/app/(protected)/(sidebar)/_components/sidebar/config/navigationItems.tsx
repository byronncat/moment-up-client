import type { NavItem } from "../types";
import { ROUTE } from "@/constants/route";
import { ExploreType } from "@/constants/server";
import {
  Message,
  Compass,
  SquarePlus,
  Bell,
  User,
  House,
} from "@/components/icons";
import { Search } from "lucide-react";

export function getNavigationItems(
  pathname: string,
  username?: string
): NavItem[] {
  return [
    {
      title: "Home",
      url: ROUTE.HOME,
      icon: (open) => (
        <House
          type={open ? "solid" : "regular"}
          className="size-7 laptop:size-5"
        />
      ),
      matchPath: () => pathname === ROUTE.HOME,
    },
    {
      title: "Search",
      url: ROUTE.SEARCH(),
      icon: (open) => (
        <Search className="size-5 laptop:size-4" strokeWidth={open ? 4 : 2} />
      ),
      matchPath: () => pathname.startsWith(ROUTE.SEARCH()),
    },
    {
      title: "Explore",
      url: ROUTE.EXPLORE(),
      icon: (open) => (
        <Compass
          type={open ? "solid" : "regular"}
          className="size-5 laptop:size-4"
        />
      ),
      matchPath: () => pathname.startsWith(ROUTE.EXPLORE(ExploreType.MEDIA)),
    },
    {
      title: "Create",
      url: ROUTE.MOMENT_CREATE,
      icon: () => <SquarePlus className="size-5 laptop:size-4" />,
    },
    {
      title: "Messages",
      url: ROUTE.MESSAGES,
      icon: () => (
        <Message variant="square" multiple className="size-5 laptop:size-4" />
      ),
      matchPath: () => pathname === ROUTE.MESSAGES,
    },
    {
      title: "Notifications",
      url: ROUTE.NOTIFICATION(),
      icon: (open) => (
        <Bell
          variant={open ? "solid" : "regular"}
          className="size-5 laptop:size-4"
        />
      ),
      matchPath: () => pathname.startsWith(ROUTE.NOTIFICATION()),
    },
    {
      title: "Profile",
      url: username ? ROUTE.PROFILE(username) : "#",
      icon: (open) => (
        <User
          type={open ? "solid" : "regular"}
          className="size-5 laptop:size-4"
        />
      ),
      matchPath: () =>
        username ? pathname.startsWith(ROUTE.PROFILE(username)) : false,
    },
  ];
}
