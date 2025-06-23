"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/providers";
import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";

import Link from "next/link";
import { ModeSelection, Logo } from "@/components";
import Tooltip from "@/components/common/Tooltip";
import {
  MessagesSquare,
  Compass,
  Home,
  SquarePlus,
  Search,
  Bell,
  Settings,
  User,
  Menu,
  Palette,
  LogOut,
  Archive,
} from "lucide-react";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SIDEBAR_COOKIE_NAME,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sourceCodePro } from "@/styles/fonts";

const XL_BREAKPOINT = 1280;

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { open, setOpen, isMobile } = useSidebar();
  const [isAboveXl, setIsAboveXl] = useState(false);
  const userPreferenceRef = useRef<boolean | null>(null);
  const isFirstRender = useRef(true);

  const items = [
    {
      title: "Home",
      url: ROUTE.HOME,
      icon: Home,
      matchPath: (pathname: string) => pathname === ROUTE.HOME,
    },
    {
      title: "Search",
      url: ROUTE.SEARCH(),
      icon: Search,
      matchPath: (pathname: string) => pathname.startsWith(ROUTE.SEARCH()),
    },
    {
      title: "Explore",
      url: ROUTE.EXPLORE(),
      icon: Compass,
      matchPath: (pathname: string) => pathname.startsWith(ROUTE.EXPLORE()),
    },
    {
      title: "Create",
      url: "#",
      icon: SquarePlus,
      matchPath: () => false,
    },
    {
      title: "Messages",
      url: ROUTE.MESSAGES,
      icon: MessagesSquare,
      matchPath: (pathname: string) => pathname === ROUTE.MESSAGES,
    },
    {
      title: "Archive",
      url: ROUTE.ARCHIVE,
      icon: Archive,
      matchPath: (pathname: string) => pathname.startsWith(ROUTE.ARCHIVE),
    },
    {
      title: "Notifications",
      url: ROUTE.NOTIFICATION(),
      icon: Bell,
      matchPath: (pathname: string) =>
        pathname.startsWith(ROUTE.NOTIFICATION()),
    },
    {
      title: "Profile",
      url: user?.username ? ROUTE.PROFILE(user.username) : "#",
      icon: User,
      matchPath: (pathname: string) => pathname.startsWith("/profile"),
    },
  ];

  function logoutHandler() {
    logout();
  }

  function getSidebarCookie(): boolean | null {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
    return cookie ? cookie.split("=")[1] === "true" : null;
  }

  useEffect(() => {
    const storedState = getSidebarCookie();
    if (storedState !== null) userPreferenceRef.current = storedState;
    else userPreferenceRef.current = true;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isXl = window.innerWidth >= XL_BREAKPOINT;

      if (isFirstRender.current) {
        setIsAboveXl(isXl);

        if (isXl) {
          const preferredState =
            userPreferenceRef.current !== null
              ? userPreferenceRef.current
              : true;
          setOpen(preferredState);
        } else setOpen(false);

        isFirstRender.current = false;
        return;
      }

      if (isXl !== isAboveXl) {
        if (isXl) {
          const preferredState =
            userPreferenceRef.current !== null
              ? userPreferenceRef.current
              : true;
          setOpen(preferredState);
        } else {
          userPreferenceRef.current = open;
          setOpen(false);
        }
        setIsAboveXl(isXl);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [open, setOpen, isAboveXl]);

  useEffect(() => {
    if (isAboveXl) userPreferenceRef.current = open;
  }, [open, isAboveXl]);

  const MobileNav = () => {
    if (!isMobile) return null;
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 z-20 w-full",
          "bg-background border-t border-border",
          "flex justify-around items-center",
          "p-2"
        )}
      >
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              "flex items-center justify-center p-2",
              "hover:bg-accent/[.1] rounded-md",
              "transition-colors duration-150 ease-in-out"
            )}
          >
            <item.icon size={24} />
          </Link>
        ))}
      </div>
    );
  };

  const SmallScreenHeader = () => {
    if (!isMobile) return null;
    return (
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-20",
          "bg-background border-b border-border",
          "flex items-center justify-between",
          "p-2 px-4 h-14"
        )}
      >
        <Link href={ROUTE.HOME} className="text-primary font-semibold text-lg">
          MomentUp
        </Link>
        <div className="flex items-center">
          <Link
            href="#"
            className={cn(
              "flex items-center justify-center",
              "p-2",
              "hover:bg-accent/[.1] rounded-md",
              "transition-colors duration-150 ease-in-out"
            )}
          >
            <Bell size={24} />
          </Link>
          <Link
            href="#"
            className={cn(
              "flex items-center justify-center",
              "p-2 ml-2",
              "hover:bg-accent/[.1] rounded-md",
              "transition-colors duration-150 ease-in-out"
            )}
          >
            <User size={24} />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <SidebarUI collapsible="icon">
        <SidebarHeader className="pt-5">
          <div className="flex justify-between items-center">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-transparent active:bg-transparent"
                >
                  {!open && <Logo />}
                  <Link href={ROUTE.HOME}>
                    <div
                      className={cn(
                        "text-primary",
                        "font-bold text-2xl tracking-wide",
                        !open && "hidden",
                        sourceCodePro.className
                      )}
                    >
                      MomentUp
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            {open && <SidebarTrigger className="text-foreground mr-3" />}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {!open ? (
                      <Tooltip content={item.title} side="right" sideOffset={6}>
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            item.matchPath(pathname) &&
                              "font-semibold bg-primary text-white hover:bg-primary/80 hover:text-white"
                          )}
                        >
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          item.matchPath(pathname) &&
                            "font-semibold bg-primary text-white hover:bg-primary/80 hover:text-white"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mb-6">
          <SidebarMenu>
            <SidebarMenuItem>
              {!open ? (
                <AlertDialog>
                  <Tooltip content="Logout" side="right" sideOffset={6}>
                    <AlertDialogTrigger asChild>
                      <SidebarMenuButton className="cursor-pointer">
                        <LogOut />
                        <span>Logout</span>
                      </SidebarMenuButton>
                    </AlertDialogTrigger>
                  </Tooltip>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently log
                        you out.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={logoutHandler}>
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer">
                      <LogOut />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently log
                        you out.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={logoutHandler}>
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </SidebarMenuItem>
            <SidebarMenuItem>
              {open ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer">
                      <Menu />
                      <span>More</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    side="top"
                    className="w-56"
                  >
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Settings size={18} />
                        <span>Settings</span>
                      </div>
                    </DropdownMenuItem>
                    <ModeSelection
                      asChild
                      showTooltip={false}
                      side="right"
                      sideOffset={8}
                    >
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Palette size={18} />
                          <span>Appearance</span>
                        </div>
                      </DropdownMenuItem>
                    </ModeSelection>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <Tooltip content="More" side="right" sideOffset={6}>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="cursor-pointer">
                        <Menu />
                        <span>More</span>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                  </Tooltip>
                  <DropdownMenuContent
                    align="start"
                    side="top"
                    className="w-56"
                  >
                    <DropdownMenuItem asChild>
                      <div className="flex items-center gap-2">
                        <Settings size={18} />
                        <span>Settings</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <ModeSelection
                        asChild
                        showTooltip={false}
                        side="right"
                        sideOffset={8}
                      >
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Palette size={18} />
                            <span>Appearance</span>
                          </div>
                        </DropdownMenuItem>
                      </ModeSelection>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarUI>

      {isAboveXl && (
        <div
          className={cn(
            "fixed top-5 left-14 z-10",
            "transition-all duration-300",
            open
              ? "opacity-0 pointer-events-none translate-x-2"
              : "opacity-100 translate-x-0"
          )}
        >
          <SidebarTrigger className="text-foreground" />
        </div>
      )}

      <SmallScreenHeader />
      <MobileNav />
    </>
  );
}
