import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/route";

import Link from "next/link";
import { Logo } from "@/components/common";
import {
  SidebarHeader as SidebarHeaderUI,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { sourceCodePro } from "@/styles/fonts";

export default function SidebarHeader() {
  const { open } = useSidebar();
  return (
    <SidebarHeaderUI
      className={cn(
        "pt-5",
        open && "px-4",
        "flex flex-row justify-between items-center"
      )}
    >
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="hover:bg-transparent active:bg-transparent"
            asChild
          >
            <Link href={ROUTE.HOME}>
              {!open && <Logo />}
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
      {open ? <SidebarTrigger className="text-foreground" /> : null}
    </SidebarHeaderUI>
  );
}
