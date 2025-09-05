"use client";

// === Type ====
import type { StoryInfo, StoryNotificationInfo } from "api";

interface StoryState {
  myStory: StoryNotificationInfo | null;
  otherStories: StoryNotificationInfo[];
  viewingStory: StoryInfo | null;
  allStories: StoryNotificationInfo[];
}

interface StoryAction {
  setViewingStory: (story: StoryInfo) => void;
  setStories: (stories: StoryNotificationInfo[]) => void;
  deleteStory: (storyId: string) => Promise<void>;
  nextUserStory: (direction?: "next" | "prev") => {
    username: string;
    id: string;
  } | null;
  muteStory: (username: string) => void;
}

// === Provider ====
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/providers";
import { toast } from "sonner";
import { CoreApi } from "@/services";
import { ROUTE } from "@/constants/route";

const StoryDataContext = createContext<StoryState & StoryAction>({
  myStory: null,
  otherStories: [],
  viewingStory: null,
  allStories: [],

  setViewingStory: () => {},
  setStories: () => {},
  deleteStory: () => Promise.resolve(),
  nextUserStory: () => null,
  muteStory: () => {},
});

export const useStory = () => useContext(StoryDataContext);
const LAST = -1;

type StoryDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function StoryDataProvider({
  children,
}: StoryDataProviderProps) {
  const [otherStories, setOtherStories] = useState<StoryNotificationInfo[]>([]);
  const [myStory, setMyStory] = useState<StoryNotificationInfo | null>(null);
  const [viewingStory, setViewingStory] = useState<StoryInfo | null>(null);

  const { user, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const username = pathname.split("/")[2];

  const allStories = useMemo(() => {
    return myStory ? [myStory, ...otherStories] : otherStories;
  }, [myStory, otherStories]);

  const changeUrl = useCallback(
    (url: string, type: "updateOnly" | "navigateFully") => {
      setTimeout(() => {
        if (type === "updateOnly") window.history.replaceState(null, "", url);
        else router.replace(url);
      }, 0);
    },
    [router]
  );

  const setStories = useCallback(
    (stories: StoryNotificationInfo[]) => {
      const mine =
        stories.find((story) => story.username === user?.username) ?? null;
      const others = stories.filter(
        (story) => story.username !== user?.username
      );
      setOtherStories(others);
      setMyStory(mine);
    },
    [user?.username]
  );

  const nextUserStory = useCallback(
    (direction: "next" | "prev" = "next") => {
      if (otherStories.length === 0) return null;

      const isMyStory = myStory?.username === username;
      const currentStoryIndex = otherStories.findIndex(
        (story) => story.username === username
      );
      if (!isMyStory && currentStoryIndex === -1) return null;

      if (isMyStory) {
        if (direction === "next")
          return {
            username: otherStories[0].username,
            id: otherStories[0].id,
          };

        const LAST = otherStories.length - 1;
        return {
          username: otherStories[LAST].username,
          id: otherStories[LAST].id,
        };
      }

      let nextIndex: number;
      if (direction === "next") {
        if (myStory && currentStoryIndex === otherStories.length - 1)
          return {
            username: myStory?.username,
            id: myStory?.id,
          };
        nextIndex =
          currentStoryIndex < otherStories.length - 1
            ? currentStoryIndex + 1
            : 0;
      } else if (myStory && currentStoryIndex === 0)
        return {
          username: myStory?.username,
          id: myStory?.id,
        };
      else
        nextIndex =
          currentStoryIndex > 0
            ? currentStoryIndex - 1
            : otherStories.length - 1;

      const nextStory = otherStories[nextIndex];
      if (nextStory) {
        return {
          username: nextStory.username,
          id: nextStory.id,
        };
      }
      return null;
    },
    [otherStories, myStory, username]
  );

  const deleteStory = useCallback(
    async (storyId: string) => {
      const { success, message } = await CoreApi.deleteStory(storyId, token);
      if (success) {
        let currentStoryIndex = viewingStory?.stories.findIndex(
          (story) => story.id === storyId
        );
        if (
          currentStoryIndex === undefined ||
          currentStoryIndex === (viewingStory?.stories.length ?? 0) - 1
        )
          currentStoryIndex = LAST;

        const stories = viewingStory?.stories.filter(
          (story) => story.id !== storyId
        );
        if (!stories) {
          toast.error("Failed to delete story");
          return;
        }

        if (stories.length === 0) {
          // No need to set viewingStory to null here because it rerenders the page (navigateFully)
          setMyStory(null);
          if (otherStories.length > 0)
            changeUrl(
              ROUTE.STORY(otherStories[0].username, otherStories[0].id),
              "navigateFully"
            );
          else setTimeout(() => router.back(), 0);
          return;
        }

        setViewingStory((prev) => {
          if (!prev) return null;
          return { ...prev, stories };
        });
        changeUrl(
          ROUTE.STORY(username, stories.at(currentStoryIndex)?.id),
          "updateOnly"
        );
      } else toast.error(message);
    },
    [otherStories, viewingStory, token, router, username, changeUrl]
  );

  const muteStory = useCallback(
    (username: string) => {
      const nextStoryIndex =
        otherStories.findIndex((story) => story.username === username) + 1;
      if (nextStoryIndex === -1) return;

      const nextStory = otherStories.at(
        nextStoryIndex === otherStories.length ? -1 : nextStoryIndex
      );
      // If there is no next story or there is only one story, navigate to the home page
      if (!nextStory || otherStories.length === 1) {
        setOtherStories([]);
        if (myStory)
          changeUrl(ROUTE.STORY(user?.username, myStory?.id), "navigateFully");
        else setTimeout(() => router.back(), 0);
        return;
      }

      setOtherStories((prev) =>
        prev.filter((story) => story.username !== username)
      );

      changeUrl(ROUTE.STORY(nextStory.username, nextStory.id), "navigateFully");
    },
    [myStory, otherStories, user?.username, router, changeUrl]
  );

  return (
    <StoryDataContext.Provider
      value={{
        myStory,
        otherStories,
        viewingStory,
        allStories,

        setViewingStory,
        setStories,
        deleteStory,
        nextUserStory,
        muteStory,
      }}
    >
      {children}
    </StoryDataContext.Provider>
  );
}
