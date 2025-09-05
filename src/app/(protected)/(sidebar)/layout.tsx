import { cookies } from "next/headers";
import { cn } from "@/libraries/utils";
import Sidebar from "./_components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CookieName } from "@/constants/client";

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
          "w-screen h-screen relative",
          "pt-14 pb-[57px] laptop:py-0"
        )}
      >
        <div className="size-full flex">
          <Sidebar />
          <div className="size-full relative">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
