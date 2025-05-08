import { cn } from "@/libraries/utils";
import {
  Footer,
  SearchBar,
  SuggestedUsers,
  SwitchAccount,
  TrendingTopics,
} from "./_components";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        "max-w-[64rem] mx-auto",
        "flex justify-center",
        "min-h-screen"
      )}
    >
      <main className="max-w-[37.5rem] w-full">{children}</main>
      <aside
        className={cn(
          "sticky top-5",
          "h-fit w-[20rem] pt-5 mr-6 ml-auto",
          "space-y-6",
          "hidden lg:block"
        )}
      >
        <SearchBar />
        <SwitchAccount />
        <div
          className={cn(
            "overflow-y-auto max-h-[calc(100vh-10rem)]",
            "space-y-6",
            "scrollbar-hide"
          )}
        >
          <TrendingTopics />
          <SuggestedUsers />
          <Footer />
        </div>
      </aside>
    </div>
  );
}
