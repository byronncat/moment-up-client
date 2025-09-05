import { useAuth } from "@/components/providers";
import { useState } from "react";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { ModeSelection, Tooltip } from "@/components/common";
import { Archive, LogOut, Menu, Palette, Settings } from "@/components/icons";
import {
  SidebarFooter as SidebarFooterUI,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
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

export default function SidebarFooter() {
  const { open } = useSidebar();
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
          <SidebarMenuItem>
            <SidebarTrigger
              isOpen={open}
              onLogout={() => setShowLogoutDialog(true)}
            />
          </SidebarMenuItem>
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

type FooterProps = Readonly<{
  isOpen: boolean;
  onLogout: () => void;
}>;

function SidebarTrigger({ isOpen, onLogout }: FooterProps) {
  const trigger = (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton className={cn("cursor-pointer", isOpen && "px-2")}>
        <span
          className={cn(
            "flex items-center justify-center",
            isOpen ? "w-5" : "px-2"
          )}
        >
          <Menu className="size-4" />
        </span>
        <span>More</span>
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );

  return (
    <DropdownMenu>
      {isOpen ? (
        trigger
      ) : (
        <Tooltip content="More" side="right" sideOffset={6}>
          {trigger}
        </Tooltip>
      )}
      <MoreDropdownContent isOpen={isOpen} onLogout={onLogout} />
    </DropdownMenu>
  );
}

function MoreDropdownContent({ isOpen, onLogout }: FooterProps) {
  return (
    <DropdownMenuContent
      align="end"
      side={isOpen ? "top" : "right"}
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
        <ModeSelection asChild showTooltip={false} side="right" sideOffset={8}>
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
        className={cn("cursor-pointer", "destructive-item")}
        onClick={onLogout}
      >
        <div className="flex items-center gap-2">
          <LogOut className="size-4" />
          <span>Logout</span>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
