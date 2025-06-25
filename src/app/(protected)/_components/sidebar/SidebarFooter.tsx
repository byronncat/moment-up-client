import { useAuth } from "@/components/providers";

import { ModeSelection, Tooltip } from "@/components";
import { Settings, Menu, Palette, LogOut } from "@/components/icons";
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
                    This action cannot be undone. This will permanently log you
                    out.
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
                    This action cannot be undone. This will permanently log you
                    out.
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
              <DropdownMenuContent align="start" side="top" className="w-56">
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
              <DropdownMenuContent align="start" side="top" className="w-56">
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
    </SidebarFooterUI>
  );
}
