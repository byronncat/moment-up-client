"use client";

import type { FeedNotificationInfo } from "api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useState } from "react";
import { useAuth } from "@/components/providers";
import { ROUTE } from "@/constants/route";
import { FIRST } from "@/constants/clientConfig";

type FeedContextType = {
  feeds: FeedNotificationInfo[] | undefined;
  myFeed: FeedNotificationInfo | null;
  totalFeeds: number;
  setFeeds: (feeds: FeedNotificationInfo[]) => void;
  navigateUser: (direction?: "next" | "prev") => void;
};

const FeedDataContext = createContext<FeedContextType>({
  feeds: undefined,
  myFeed: null,
  totalFeeds: 0,
  setFeeds: () => {},
  navigateUser: () => false,
});

export const useFeed = () => useContext(FeedDataContext);

type FeedDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function FeedDataProvider({ children }: FeedDataProviderProps) {
  const { user } = useAuth();
  const [feeds, _setFeeds] = useState<FeedNotificationInfo[]>([]);
  const [myFeed, setMyFeed] = useState<FeedNotificationInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const username = pathname.split("/")[2];

  const totalFeeds = feeds.length;

  const setFeeds = useCallback(
    (feeds: FeedNotificationInfo[]) => {
      const mine =
        feeds.find((feed) => feed.username === user?.username) ?? null;
      const others = feeds.filter((feed) => feed.username !== user?.username);
      _setFeeds(others);
      setMyFeed(mine);
    },
    [user?.username]
  );

  const navigateUser = useCallback(
    (direction: "next" | "prev" = "next") => {
      if (totalFeeds === 0) return;

      const isMyFeed = myFeed?.username === username;
      const currentFeedIndex = feeds.findIndex(
        (feed) => feed.username === username
      );
      if (!isMyFeed && currentFeedIndex === -1) return;

      if (isMyFeed) {
        if (direction === "next")
          router.replace(ROUTE.FEED(feeds[FIRST].username, feeds[FIRST].id));
        else {
          const LAST = totalFeeds - 1;
          router.replace(ROUTE.FEED(feeds[LAST].username, feeds[LAST].id));
        }
        return;
      }

      let nextIndex: number;
      if (direction === "next") {
        if (myFeed && currentFeedIndex === totalFeeds - 1) {
          router.replace(ROUTE.FEED(myFeed.username, myFeed.id));
          return;
        } else
          nextIndex =
            currentFeedIndex < totalFeeds - 1 ? currentFeedIndex + 1 : 0;
      } else {
        if (myFeed && currentFeedIndex === 0) {
          router.replace(ROUTE.FEED(myFeed.username, myFeed.id));
          return;
        } else
          nextIndex =
            currentFeedIndex > 0 ? currentFeedIndex - 1 : totalFeeds - 1;
      }

      const nextFeed = feeds[nextIndex];
      if (nextFeed) router.replace(ROUTE.FEED(nextFeed.username, nextFeed.id));
    },
    [feeds, myFeed, totalFeeds, username, router]
  );

  return (
    <FeedDataContext.Provider
      value={{
        feeds,
        myFeed,
        totalFeeds,
        setFeeds,
        navigateUser,
      }}
    >
      {children}
    </FeedDataContext.Provider>
  );
}
