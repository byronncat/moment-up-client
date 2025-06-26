import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MomentDataProvider } from "@/components/providers";
import { cn } from "@/libraries/utils";
import { Sidebar } from "./_components";

export default async function Layout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div
        className={cn(
          "w-screen h-screen relative",
          "pt-14 pb-[57px] laptop:py-0"
        )}
      >
        <div className="size-full">
          <MomentDataProvider>
            <div className="size-full flex flex-row">
              <Sidebar />
              <div className="size-full relative">{children}</div>
              {modal}
            </div>
          </MomentDataProvider>
        </div>
      </div>
    </SidebarProvider>
  );
}
