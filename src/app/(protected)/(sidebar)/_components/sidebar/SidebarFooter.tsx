import { useAuth } from "@/components/providers";
import { useState } from "react";
import { ROUTE } from "@/constants/route";
import { useTheme } from "next-themes";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Tooltip } from "@/components/common";
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Archive,
  LaptopMinimal,
  LogOut,
  Menu,
  Moon,
  Palette,
  Settings,
  Sun,
} from "@/components/icons";

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
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      label: "Light",
      icon: <Sun type="regular" className="size-4" />,
      selected: theme === "light",
      onClick: () => setTheme("light"),
    },
    {
      label: "Dark",
      icon: <Moon type="regular" className="size-4" />,
      selected: theme === "dark",
      onClick: () => setTheme("dark"),
    },
    {
      label: "System",
      icon: <LaptopMinimal className="size-4" />,
      selected: theme === "system",
      onClick: () => setTheme("system"),
    },
  ];

  return (
    <DropdownMenuContent
      align="end"
      side={isOpen ? "top" : "right"}
      className="w-56"
    >
      <DropdownMenuGroup>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ROUTE.ARCHIVE("bookmarks")}>
            <Archive className="size-4" />
            <span>Archive</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            submenuId="appearance"
            submenuTitle="Appearance"
            className="cursor-pointer"
          >
            <Palette className="size-4" />
            <span>Appearance</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent submenuId="appearance" sideOffset={6}>
            {themeOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                onClick={option.onClick}
                className="cursor-pointer"
                disabled={option.selected}
              >
                {option.icon}
                <span>{option.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ROUTE.SETTINGS}>
            <Settings className="size-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className={cn("cursor-pointer", "destructive-item")}
        onClick={onLogout}
      >
        <LogOut className="size-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
