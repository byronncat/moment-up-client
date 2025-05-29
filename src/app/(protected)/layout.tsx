import { cookies } from "next/headers";
import { Sidebar } from "./_components";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";

  return (
    <div className="w-screen h-screen relative">
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar />
        <div className="h-screen w-full sm:w-[calc(100%-3rem)]">{children}</div>
      </SidebarProvider>
      {modal}
    </div>
  );
}
