import { cn } from "@/libraries/utils";
import SearchBar from "../Search/SearchBar";
import SwitchAccount from "./switch-account";
import TrendingTopics from "./TrendingTopics";
import SuggestedUsers from "./SuggestedUsers";
import Footer from "./Footer";
import NoAuth from "./NoAuth";

import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/constants/clientConfig";

export default async function Aside({
  className,
}: Readonly<{ className?: string }>) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.has(AUTH_COOKIE_NAME);

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
          <NoAuth />
          <Footer />
        </>
      )}
    </aside>
  );
}
