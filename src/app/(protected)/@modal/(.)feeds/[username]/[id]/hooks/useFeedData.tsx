"use client";

import type { FeedNotificationInfo } from "api";
import { createContext, useCallback, useContext, useState } from "react";
import { useAuth } from "@/components/providers";

type FeedContextType = {
  feeds: FeedNotificationInfo[] | undefined;
  myFeed: FeedNotificationInfo | null;
  totalFeeds: number;
  setFeeds: (feeds: FeedNotificationInfo[]) => void;
  currentUser: string | null;
  setCurrentUser: (id: string | null) => void;
  navigateUser: (direction?: "next" | "prev") => boolean;
};

const FeedDataContext = createContext<FeedContextType>({
  feeds: undefined,
  myFeed: null,
  totalFeeds: 0,
  setFeeds: () => {},
  currentUser: null,
  setCurrentUser: () => {},
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
  const [currentUser, setCurrentUser] = useState<string | null>(null);

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
      const currentFeedIndex = feeds.findIndex(
        (feed) => feed.userId === currentUser
      );
      if (currentFeedIndex === -1) return false;

      let nextIndex: number;
      if (direction === "next")
        nextIndex =
          currentFeedIndex < feeds.length - 1 ? currentFeedIndex + 1 : 0;
      else
        nextIndex =
          currentFeedIndex > 0 ? currentFeedIndex - 1 : feeds.length - 1;

      setCurrentUser(feeds[nextIndex].username);
      return true;
    },
    [feeds, currentUser]
  );

  return (
    <FeedDataContext.Provider
      value={{
        feeds,
        myFeed,
        totalFeeds,
        setFeeds,
        currentUser,
        setCurrentUser,
        navigateUser,
      }}
    >
      {children}
    </FeedDataContext.Provider>
  );
}
