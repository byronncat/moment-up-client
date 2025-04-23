import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { Sidebar } from "./_components";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Layout({ children }: LayoutProps) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";

  return (
    <div className="w-screen h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar />
        <div className="h-screen w-full sm:w-[calc(100%-3rem)]">
          <ScrollArea
            className={cn(
              "size-full [&_[data-radix-scroll-area-viewport]>:first-child]:!block",
              "pt-14 sm:pt-0",
              "pb-14 sm:pb-0"
            )}
            thumbClassName="z-50"
          >
            {children}
          </ScrollArea>
        </div>
      </SidebarProvider>
    </div>
  );
}
