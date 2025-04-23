import { cn } from "@/lib/utils";
import {
  Footer,
  SearchBar,
  SuggestedUsers,
  SwitchAccount,
  TrendingTopics,
} from "./_components";

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={cn("max-w-[64rem] mx-auto", "flex justify-center")}>
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
        <TrendingTopics />
        <SuggestedUsers />
        <Footer />
      </aside>
    </div>
  );
}
