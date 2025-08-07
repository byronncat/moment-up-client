import { cookies } from "next/headers";
import { cn } from "@/libraries/utils";
import { Sidebar } from "./_components";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MomentDataProvider } from "@/components/providers";
import FeedDataProvider from "./@modal/(.)feeds/[username]/[id]/hooks/useFeedData";
import { CookieName } from "@/constants/clientConfig";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default async function Layout({ children, modal }: LayoutProps) {
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
          <MomentDataProvider>
            <FeedDataProvider>
              <div className="size-full relative">{children}</div>
              {modal}
            </FeedDataProvider>
          </MomentDataProvider>
        </div>
      </div>
    </SidebarProvider>
  );
}
