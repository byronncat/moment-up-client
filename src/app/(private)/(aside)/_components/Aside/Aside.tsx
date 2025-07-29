import { cn } from "@/libraries/utils";
import SearchBar from "../Search/SearchBar";
import SwitchAccount from "./switch-account";
import TrendingTopics from "./TrendingTopics";
import SuggestedUsers from "./SuggestedUsers";
import Footer from "./Footer";

export default function Aside({ className }: Readonly<{ className?: string }>) {
  return (
    <aside className={cn("h-fit w-[320px]", "space-y-6", className)}>
      <SearchBar />
      <SwitchAccount />
      <div
        className={cn(
          "overflow-y-auto max-h-[calc(100vh-160px)]",
          "space-y-6",
          "scrollbar-hide"
        )}
      >
        <TrendingTopics />
        <SuggestedUsers />
        <Footer />
      </div>
    </aside>
  );
}
