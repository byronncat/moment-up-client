import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components";
import { ModeToggle } from "@/components";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function Layout({
  children,
  stories,
  moments,
}: Readonly<{
  children: React.ReactNode;
  stories: React.ReactNode;
  moments: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";
  const session = cookieStore.get("session");

  // if (!session) return null;
  return (
    <div className="w-screen h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar />
        <div className="h-screen w-full">
          <div className={cn("overflow-y-auto h-full", "relative")}>
            <div
              className={cn(
                "flex justify-between items-center",
                "h-14 w-full px-3",
                "sticky top-0 right-0"
              )}
            >
              <SidebarTrigger className="mt-5 text-foreground" />
              <ModeToggle />
            </div>
            <div className="-mt-14">{children}</div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
