import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";

import Link from "next/link";
import { Logo } from "@/components/common";
import {
  SidebarHeader as SidebarHeaderUI,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { sourceCodePro } from "@/styles/fonts";

type SidebarHeaderProps = Readonly<{
  open: boolean;
}>;

export default function SidebarHeader({ open }: SidebarHeaderProps) {
  return (
    <SidebarHeaderUI className="pt-5">
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
    </SidebarHeaderUI>
  );
}
