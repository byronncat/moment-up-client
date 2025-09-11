import { cn } from "@/libraries/utils";
import SearchBar from "../search/SearchBar";
import SwitchAccount from "./switch-account";
import TrendingTopics from "./TrendingTopics";
import SuggestedUsers from "./SuggestedUsers";
import Footer from "./Footer";
import AuthOptions from "./AuthOptions";

import { cookies } from "next/headers";
import { CookieName } from "@/constants/client";

export default async function Aside({
  className,
}: Readonly<{ className?: string }>) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.has(CookieName.AUTH_GUARD);

  return (
    <aside className={cn("h-fit w-[320px]", "space-y-6", className)}>
      {isAuth ? (
        <>
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
        </>
      ) : (
        <>
          <AuthOptions />
          <Footer />
        </>
      )}
    </aside>
  );
}
