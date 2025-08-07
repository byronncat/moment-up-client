"use client";

import type { FeedNotificationInfo } from "api";
import { createContext, useCallback, useContext, useState } from "react";

type FeedContextType = {
  feeds: FeedNotificationInfo[] | undefined;
  totalFeeds: number;
  setFeeds: (feeds: FeedNotificationInfo[]) => void;
  currentUser: string | null;
  setUserId: (id: string | null) => void;
  getCurrentUserId: () => string | null;
  navigateUser: (direction?: "next" | "prev") => boolean;
};

const FeedDataContext = createContext<FeedContextType>({
  feeds: undefined,
  totalFeeds: 0,
  setFeeds: () => {},
  currentUser: null,
  setUserId: () => {},
  getCurrentUserId: () => null,
  navigateUser: () => false,
});

export const useFeed = () => useContext(FeedDataContext);

type FeedDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function FeedDataProvider({ children }: FeedDataProviderProps) {
  const [feeds, setFeeds] = useState<FeedNotificationInfo[]>([]);
  const [currentUser, setUserId] = useState<string | null>(null);

  const totalFeeds = feeds.length;

  const getCurrentUserId = useCallback(() => {
    const currentFeed = feeds.find((feed) => feed.userId === currentUser);
    return currentFeed?.userId || null;
  }, [feeds, currentUser]);

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

      setUserId(feeds[nextIndex].userId);
      return true;
    },
    [feeds, currentUser]
  );

  return (
    <FeedDataContext.Provider
      value={{
        feeds,
        totalFeeds,
        setFeeds,
        currentUser,
        setUserId,
        getCurrentUserId,
        navigateUser,
      }}
    >
      {children}
    </FeedDataContext.Provider>
  );
}
