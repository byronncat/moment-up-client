import { useAuth } from "@/components/providers";
import { ROUTE } from "@/constants/route";

import Link from "next/link";
import { ModeSelection, Tooltip } from "@/components/common";
import { Settings, Menu, Palette, LogOut, Archive } from "@/components/icons";
import {
  SidebarFooter as SidebarFooterUI,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

type SidebarFooterProps = Readonly<{
  open: boolean;
}>;

export default function SidebarFooter({ open }: SidebarFooterProps) {
  const { logout } = useAuth();
  function logoutHandler() {
    logout();
  }

  return (
    <SidebarFooterUI className="mb-6">
      <SidebarMenu>
        {open ? (
          <>
            <SidebarMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <SidebarMenuButton className="cursor-pointer px-2">
                    <span className="flex items-center justify-center w-5">
                      <LogOut className="size-4" />
                    </span>
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
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="cursor-pointer px-2">
                    <span className="flex items-center justify-center w-5">
                      <Menu className="size-4" />
                    </span>
                    <span>More</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="w-56">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={ROUTE.ARCHIVE("bookmarks")}>
                      <div className="flex items-center gap-2">
                        <Archive className="size-4" />
                        <span>Archive</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <ModeSelection
                    asChild
                    showTooltip={false}
                    side="right"
                    sideOffset={8}
                  >
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Palette className="size-4" />
                        <span>Appearance</span>
                      </div>
                    </DropdownMenuItem>
                  </ModeSelection>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={ROUTE.SETTINGS}>
                      <div className="flex items-center gap-2">
                        <Settings className="size-4" />
                        <span>Settings</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </>
        ) : (
          <>
            <SidebarMenuItem>
              <AlertDialog>
                <Tooltip content="Logout" side="right" sideOffset={6}>
                  <AlertDialogTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer">
                      <span className="flex items-center justify-center px-2">
                        <LogOut className="size-4" />
                      </span>
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
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <Tooltip content="More" side="right" sideOffset={6}>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer">
                      <span className="flex items-center justify-center px-2">
                        <Menu className="size-4" />
                      </span>
                      <span>More</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                </Tooltip>
                <DropdownMenuContent align="start" side="top" className="w-56">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={ROUTE.ARCHIVE("bookmarks")}>
                      <div className="flex items-center gap-2">
                        <Archive className="size-4" />
                        <span>Archive</span>
                      </div>
                    </Link>
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
                          <Palette className="size-4" />
                          <span>Appearance</span>
                        </div>
                      </DropdownMenuItem>
                    </ModeSelection>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={ROUTE.SETTINGS}>
                      <div className="flex items-center gap-2">
                        <Settings className="size-4" />
                        <span>Settings</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </>
        )}
      </SidebarMenu>
    </SidebarFooterUI>
  );
}
