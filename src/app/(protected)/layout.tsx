import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  SearchBar,
  SwitchAccount,
  SuggestedUsers,
  Footer,
} from "./_components";

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
              "h-full",
              "relative",
              "pt-14 sm:pt-0",
              "pb-14 sm:pb-0"
            )}
          >
            <div className={cn("size-full", "overflow-y-auto")}>
              <div
                className={cn("max-w-[64rem] mx-auto", "flex justify-center")}
              >
                <main className="max-w-[37.5rem] w-full">{children}</main>

                <aside
                  className={cn(
                    "sticky top-5",
                    "h-fit w-[20rem] mr-6 ml-auto",
                    "space-y-6",
                    "hidden lg:block"
                  )}
                >
                  <SearchBar />
                  <SwitchAccount />
                  <SuggestedUsers />
                  <Footer />
                </aside>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
