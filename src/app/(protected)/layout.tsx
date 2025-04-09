import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components";
import { ModeSelection } from "@/components";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";
  const session = cookieStore.get("session");

  // if (!session) return null;
  return (
    <div className="w-screen h-screen">
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar />
        <div className="h-screen w-full sm:w-[calc(100%-3rem)]">
          <div
            className={cn(
              "overflow-y-auto h-full",
              "relative",
              "pt-14 sm:pt-0",
              "pb-16 sm:pb-0"
            )}
          >
            <div>{children}</div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
