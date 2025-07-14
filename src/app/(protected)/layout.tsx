import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MomentDataProvider } from "@/components/providers";
import { cn } from "@/libraries/utils";
import { Sidebar } from "./_components";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default async function Layout({ children, modal }: LayoutProps) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <main
        className={cn(
          "w-screen h-screen relative",
          "pt-14 pb-[57px] laptop:py-0"
        )}
      >
        <div className="size-full flex">
          <Sidebar />
          <MomentDataProvider>
            <section className="size-full relative" role="main">
              {children}
            </section>
            {modal}
          </MomentDataProvider>
        </div>
      </main>
    </SidebarProvider>
  );
}
