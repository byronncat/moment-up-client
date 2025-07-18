import type { NavItem } from "../types";
import { ROUTE } from "@/constants/route";
import {
  Message,
  Compass,
  SquarePlus,
  Bell,
  MagnifyingGlass,
  User,
  House,
} from "@/components/icons";

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
      icon: () => <MagnifyingGlass className="size-5 laptop:size-4" />,
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
      matchPath: () => pathname.startsWith(ROUTE.EXPLORE()),
    },
    {
      title: "Create",
      url: "#",
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
      matchPath: () => pathname.startsWith("/profile"),
    },
  ];
}
