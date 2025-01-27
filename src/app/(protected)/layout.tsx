import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/components";
import { ModeToggle } from "@/components";
import { cn } from "@/lib/utils";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";
  const session = cookieStore.get("session");

  if (!session) return null;
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
            <main className="-mt-14">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
