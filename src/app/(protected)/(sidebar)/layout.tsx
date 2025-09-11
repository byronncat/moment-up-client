import { cookies } from "next/headers";
import { CookieName, MOBILE_NAV_HEIGHT } from "@/constants/client";

import { cn } from "@/libraries/utils";
import Sidebar from "./_components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout({ children }: LayoutProps) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get(CookieName.SIDEBAR)?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div
        className={cn(
          "w-screen h-screen",
          "relative",
          "laptop:!py-0",
          "laptop:overflow-y-auto"
        )}
        style={{
          paddingTop: MOBILE_NAV_HEIGHT,
          paddingBottom: MOBILE_NAV_HEIGHT,
        }}
      >
        <div className="min-h-full flex">
          <Sidebar />
          <div className="size-full grow">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
