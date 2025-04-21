"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/providers";
import { cn } from "@/lib/utils";
import { ROUTE } from "@/constants/clientConfig";

import { Logo, Tooltip } from "@/components";
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
  Save,
  Activity,
  RotateCcw,
  LogOut,
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

const items = [
  {
    title: "Home",
    url: ROUTE.HOME,
    icon: Home,
  },
  {
    title: "Search",
    url: ROUTE.SEARCH,
    icon: Search,
  },
  {
    title: "Explore",
    url: ROUTE.EXPLORE(),
    icon: Compass,
  },
  {
    title: "Create",
    url: "#",
    icon: SquarePlus,
  },
  {
    title: "Messages",
    url: ROUTE.MESSAGES,
    icon: MessagesSquare,
  },
  {
    title: "Notifications",
    url: ROUTE.NOTIFICATION(),
    icon: Bell,
  },
  {
    title: "Profile",
    url: ROUTE.PROFILE("username"),
    icon: User,
  },
];

const moreItems = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Your activity",
    url: "#",
    icon: Activity,
  },
  {
    title: "Saved",
    url: "#",
    icon: Save,
  },
  {
    title: "Switch appearance",
    url: "#",
    icon: RotateCcw,
  },
  {
    title: "Report a problem",
    url: "#",
    icon: RotateCcw,
  },
];

const XL_BREAKPOINT = 1280;

export default function Sidebar() {
  const { logout } = useAuth();
  const { open, setOpen, isMobile } = useSidebar();
  const [isAboveXl, setIsAboveXl] = useState(false);
  const userPreferenceRef = useRef<boolean | null>(null);
  const isFirstRender = useRef(true);

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
    console.log("getSidebarCookie");
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
          "fixed bottom-0 left-0 z-50 w-full",
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
          "fixed top-0 left-0 right-0 z-50",
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
                        <SidebarMenuButton asChild>
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton asChild>
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
              {!open ? (
                <Tooltip content="More" side="right" sideOffset={6}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="cursor-pointer">
                        <Menu />
                        <span>More</span>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="right"
                      className="w-56"
                    >
                      {moreItems.map((item) => (
                        <DropdownMenuItem key={item.title} asChild>
                          <Link
                            href={item.url}
                            className="flex items-center gap-2"
                          >
                            <item.icon size={18} />
                            <span>{item.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Tooltip>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer">
                      <Menu />
                      <span>More</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    side="right"
                    className="w-56"
                  >
                    {moreItems.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
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
            "fixed top-5 left-14 z-20",
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
