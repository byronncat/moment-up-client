"use client";

import type { StoryNotificationInfo } from "api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useState } from "react";
import { useAuth } from "@/components/providers";
import { ROUTE } from "@/constants/route";
import { FIRST } from "@/constants/clientConfig";

type StoryContextType = {
  stories: StoryNotificationInfo[] | undefined;
  myStory: StoryNotificationInfo | null;
  totalStories: number;
  setStories: (stories: StoryNotificationInfo[]) => void;
  navigateUser: (direction?: "next" | "prev") => void;
};

const StoryDataContext = createContext<StoryContextType>({
  stories: undefined,
  myStory: null,
  totalStories: 0,
  setStories: () => {},
  navigateUser: () => false,
});

export const useStory = () => useContext(StoryDataContext);

type StoryDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function StoryDataProvider({
  children,
}: StoryDataProviderProps) {
  const { user } = useAuth();
  const [stories, _setStories] = useState<StoryNotificationInfo[]>([]);
  const [myStory, setMyStory] = useState<StoryNotificationInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const username = pathname.split("/")[2];

  const totalStories = stories.length;

  const setStories = useCallback(
    (stories: StoryNotificationInfo[]) => {
      const mine =
        stories.find((story) => story.username === user?.username) ?? null;
      const others = stories.filter(
        (story) => story.username !== user?.username
      );
      _setStories(others);
      setMyStory(mine);
    },
    [user?.username]
  );

  const navigateUser = useCallback(
    (direction: "next" | "prev" = "next") => {
      if (totalStories === 0) return;

      const isMyStory = myStory?.username === username;
      const currentStoryIndex = stories.findIndex(
        (story) => story.username === username
      );
      if (!isMyStory && currentStoryIndex === -1) return;

      if (isMyStory) {
        if (direction === "next")
          router.replace(
            ROUTE.STORY(stories[FIRST].username, stories[FIRST].id)
          );
        else {
          const LAST = totalStories - 1;
          router.replace(ROUTE.STORY(stories[LAST].username, stories[LAST].id));
        }
        return;
      }

      let nextIndex: number;
      if (direction === "next") {
        if (myStory && currentStoryIndex === totalStories - 1) {
          router.replace(ROUTE.STORY(myStory.username, myStory.id));
          return;
        } else
          nextIndex =
            currentStoryIndex < totalStories - 1 ? currentStoryIndex + 1 : 0;
      } else {
        if (myStory && currentStoryIndex === 0) {
          router.replace(ROUTE.STORY(myStory.username, myStory.id));
          return;
        } else
          nextIndex =
            currentStoryIndex > 0 ? currentStoryIndex - 1 : totalStories - 1;
      }

      const nextStory = stories[nextIndex];
      if (nextStory)
        router.replace(ROUTE.STORY(nextStory.username, nextStory.id));
    },
    [stories, myStory, totalStories, username, router]
  );

  return (
    <StoryDataContext.Provider
      value={{
        stories,
        myStory,
        totalStories,
        setStories,
        navigateUser,
      }}
    >
      {children}
    </StoryDataContext.Provider>
  );
}
