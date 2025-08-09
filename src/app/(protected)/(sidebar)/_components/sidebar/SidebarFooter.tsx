import { useAuth } from "@/components/providers";
import { useState } from "react";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { styles } from "@/constants/clientConfig";

type SidebarFooterProps = Readonly<{
  open: boolean;
}>;

export default function SidebarFooter({ open }: SidebarFooterProps) {
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  function handleLogout() {
    logout();
    setShowLogoutDialog(false);
  }

  return (
    <>
      <SidebarFooterUI className="mb-6">
        <SidebarMenu>
          {open ? (
            <>
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
                  <DropdownMenuContent
                    align="start"
                    side="top"
                    className="w-56"
                  >
                    <DropdownMenuGroup>
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
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className={cn(
                        "cursor-pointer",
                        styles.destructiveDropdownMenuItem
                      )}
                      onClick={() => setShowLogoutDialog(true)}
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="size-4" />
                        <span>Logout</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </>
          ) : (
            <>
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
                  <DropdownMenuContent
                    align="start"
                    side="top"
                    className="w-56"
                  >
                    <DropdownMenuGroup>
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
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className={cn(
                        "cursor-pointer",
                        styles.destructiveDropdownMenuItem
                      )}
                      onClick={() => setShowLogoutDialog(true)}
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="size-4" />
                        <span>Logout</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooterUI>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently log you out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
