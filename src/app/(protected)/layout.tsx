import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { Sidebar } from "./_components";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({ children }: LayoutProps) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";

  return (
    <div className="w-screen h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar />
        <div className="h-screen w-full sm:w-[calc(100%-3rem)]">
          <div
            className={cn(
              "h-full",
              "relative",
              "pt-14 sm:pt-0",
              "pb-14 sm:pb-0"
            )}
          >
            <div className={cn("size-full", "overflow-y-auto")}>{children}</div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
