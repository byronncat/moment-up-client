"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStory } from "@/components/providers";
import { useContentProgress, useSound } from "./hooks";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Container from "./Container";
import Content from "./Content";
import { ConfirmState, ErrorState, LoadingState } from "./state";
import {
  ActionButtons,
  NavigateButtons,
  ProgressBar,
  UserInfo,
} from "./controls";

type StoryViewProps = Readonly<{
  loading: boolean;
  onClose: () => void;
  confirm?: boolean;
  className?: string;
}>;

export default function StoryView({
  loading,
  onClose,
  confirm = false,
  className,
}: StoryViewProps) {
  const pathname = usePathname();
  const router = useRouter();
  const username = pathname.split("/")[2];
  const storyId = pathname.split("/")[3];

  const { viewingStories, otherStories, nextUserStory } = useStory();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(() => {
    const index = viewingStories?.stories.findIndex(
      (story) => story.id === storyId
    );
    return index !== undefined && index !== -1 ? index : 0;
  });
  const [_confirm, setConfirm] = useState(confirm);
  const [dataLoaded, setDataLoaded] = useState({
    storyId: "",
    content: false,
    sound: false,
  });

  const currentStoryData = (() => {
    const totalStories = viewingStories?.stories.length ?? 0;

    if (currentStoryIndex >= totalStories) {
      const index = totalStories - 1 > 0 ? totalStories - 1 : 0;
      return viewingStories?.stories.at(index);
    }

    return viewingStories?.stories[currentStoryIndex];
  })();

  function changeUrl(url: string, type: "updateOnly" | "navigateFully") {
    setTimeout(() => {
      if (type === "updateOnly") window.history.replaceState(null, "", url);
      else router.replace(url);
    }, 0);
  }

  function handleNavigate(direction: "prev" | "next") {
    const storiesLength = viewingStories?.stories.length ?? 0;
    const isPrev = direction === "prev";
    const isNext = direction === "next";

    setDataLoaded((prev) => ({
      ...prev,
      content: false,
      sound: false,
    }));

    if (isPrev || isNext) {
      const offset = isPrev ? -1 : 1;
      const limit = isPrev ? 0 : storiesLength - 1;

      const atBoundary = isPrev
        ? currentStoryIndex <= limit
        : currentStoryIndex >= limit;

      if (!atBoundary) {
        const newIndex = currentStoryIndex + offset;
        setCurrentStoryIndex(newIndex);
        changeUrl(
          ROUTE.STORY(username, viewingStories?.stories[newIndex].id),
          "updateOnly"
        );
      } else {
        // No need to set currentStoryIndex to 0 here because it rerenders the page (navigateFully)
        const nextStory = nextUserStory(direction);
        if (nextStory)
          changeUrl(
            ROUTE.STORY(nextStory.username, nextStory.id),
            "navigateFully"
          );
        else onClose();
      }
    }
  }

  function handleSegmentClick(index: number) {
    setDataLoaded((prev) => ({
      ...prev,
      content: false,
      sound: false,
    }));

    setCurrentStoryIndex(index);
    changeUrl(
      ROUTE.STORY(username, viewingStories?.stories[index].id),
      "updateOnly"
    );
  }

  function handleViewComplete() {
    handleNavigate("next");
  }

  const allDataLoaded =
    dataLoaded.storyId === currentStoryData?.id &&
    dataLoaded.content &&
    dataLoaded.sound &&
    _confirm;

  const shouldPlay = _confirm && allDataLoaded;

  const {
    isPlaying,
    progress,
    pause,
    play,
    reset,
    setVideoRef: setContentVideoRef,
  } = useContentProgress(
    currentStoryData?.content,
    shouldPlay,
    handleViewComplete
  );

  const {
    haveSound,
    isSoundOn,
    toggleSoundOn,
    setVideoRef: setSoundVideoRef,
  } = useSound(currentStoryData, isPlaying, shouldPlay, () =>
    setDataLoaded((prev) => ({
      ...prev,
      sound: true,
    }))
  );

  function handleSetVideoRef(video: HTMLVideoElement | null) {
    setContentVideoRef(video);
    setSoundVideoRef(video);
  }

  function handleConfirm() {
    const currentIndex = viewingStories?.stories.findIndex(
      (story) => story.id === pathname.split("/")[3]
    );
    setCurrentStoryIndex(
      currentIndex !== undefined && currentIndex !== -1 ? currentIndex : 0
    );

    setConfirm(true);
    play();
  }

  useEffect(() => {
    if (_confirm) reset();
  }, [currentStoryData, _confirm, reset]);

  if (!_confirm)
    return <ConfirmState onConfirm={handleConfirm} className={className} />;
  if (loading) return <LoadingState className={className} />;
  if (!currentStoryData || !viewingStories)
    return <ErrorState onClose={onClose} className={className} />;
  return (
    <Container className={className}>
      <div className={cn("absolute top-0 left-0 z-10", "px-2 pt-2 w-full")}>
        <span
          className={cn(
            "absolute top-0 left-0 -z-10",
            "h-[calc(100%+24px)] w-full",
            "mobile:rounded-t-lg overflow-hidden"
          )}
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0) 100%)",
          }}
        />

        <ProgressBar
          total={viewingStories?.stories.length ?? 0}
          current={currentStoryIndex}
          progress={progress}
          onSegmentClick={(index) => handleSegmentClick(index)}
        />

        <div className={cn("flex justify-between items-start", "mt-3")}>
          <UserInfo
            data={viewingStories.user}
            timestamp={currentStoryData.createdAt}
          />
          <ActionButtons
            isPlaying={isPlaying}
            isSoundOn={haveSound ? isSoundOn : null}
            onPlay={play}
            onPause={pause}
            onSoundToggle={toggleSoundOn}
          />
        </div>
      </div>

      <Content
        content={currentStoryData.content}
        setVideoRef={handleSetVideoRef}
        onLoadingComplete={() =>
          setDataLoaded((prev) => ({
            ...prev,
            storyId: currentStoryData.id,
            content: true,
          }))
        }
      />

      {((viewingStories?.stories.length ?? 0) > 1 ||
        otherStories.length > 1) && (
        <NavigateButtons onNavigate={handleNavigate} />
      )}
    </Container>
  );
}
