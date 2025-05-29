import { cn } from "@/libraries/utils";
import SwitchAccount from "./SwitchAccount";
import SuggestedUsers from "./SuggestedUsers";
import Footer from "./Footer";
import TrendingTopics from "./TrendingTopics";
import SearchBar from "../Search/SearchBar";


export default function Aside() {
  return (
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
  );
}