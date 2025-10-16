"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStory } from "@/components/providers";
import { useContentProgress, useSound } from "./hooks";

import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/route";

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
  const { viewingStory, otherStories, nextUserStory } = useStory();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [_confirm, setConfirm] = useState(confirm);

  const username = useMemo(() => {
    return pathname.split("/")[2];
  }, [pathname]);

  const currentStory = useMemo(() => {
    const totalStories = viewingStory?.stories.length ?? 0;

    if (currentStoryIndex >= totalStories) {
      const index = totalStories - 1 > 0 ? totalStories - 1 : 0;
      // setCurrentStoryIndex(index);
      return viewingStory?.stories.at(index);
    }

    return viewingStory?.stories[currentStoryIndex];
  }, [viewingStory, currentStoryIndex]);

  const changeUrl = useCallback(
    (url: string, type: "updateOnly" | "navigateFully") => {
      setTimeout(() => {
        if (type === "updateOnly") window.history.replaceState(null, "", url);
        else router.replace(url);
      }, 0);
    },
    [router]
  );

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      const storiesLength = viewingStory?.stories.length ?? 0;
      const isPrev = direction === "prev";
      const isNext = direction === "next";

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
            ROUTE.STORY(username, viewingStory?.stories[newIndex].id),
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
    },
    [
      username,
      viewingStory,
      currentStoryIndex,
      nextUserStory,
      changeUrl,
      onClose,
    ]
  );

  const handleSegmentClick = useCallback(
    (index: number) => {
      setCurrentStoryIndex(index);
      changeUrl(
        ROUTE.STORY(username, viewingStory?.stories[index].id),
        "updateOnly"
      );
    },
    [username, viewingStory, changeUrl]
  );

  const handleViewComplete = useCallback(() => {
    handleNavigate("next");
  }, [handleNavigate]);

  const {
    isPlaying,
    progress,
    pause,
    play,
    reset,
    setVideoRef: setContentVideoRef,
  } = useContentProgress(currentStory?.content, handleViewComplete, _confirm);

  const {
    haveSound,
    isSoundOn,
    toggleSoundOn,
    setVideoRef: setSoundVideoRef,
  } = useSound(currentStory, isPlaying, _confirm);

  const handleSetVideoRef = useCallback(
    (video: HTMLVideoElement | null) => {
      setContentVideoRef(video);
      setSoundVideoRef(video);
    },
    [setContentVideoRef, setSoundVideoRef]
  );

  const handleConfirm = useCallback(() => {
    const currentIndex = viewingStory?.stories.findIndex(
      (story) => story.id === pathname.split("/")[3]
    );
    setCurrentStoryIndex(
      currentIndex !== undefined && currentIndex !== -1 ? currentIndex : 0
    );

    setConfirm(true);
    play();
  }, [play, pathname, viewingStory]);

  useEffect(() => {
    if (_confirm) reset();
  }, [currentStory, _confirm, reset]);

  if (!_confirm)
    return <ConfirmState onConfirm={handleConfirm} className={className} />;
  if (loading) return <LoadingState className={className} />;
  if (!currentStory)
    return <ErrorState onClose={onClose} className={className} />;
  return (
    <Container className={className}>
      <div className={cn("absolute top-0 left-0 z-10", "px-2 pt-2 w-full")}>
        <span
          className={cn(
            "absolute top-0 left-0 -z-10",
            "h-[calc(100%+24px)] w-full"
          )}
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0) 100%)",
          }}
        />
        <ProgressBar
          total={viewingStory?.stories.length ?? 0}
          current={currentStoryIndex}
          progress={progress}
          onSegmentClick={(index) => handleSegmentClick(index)}
        />
        <div className={cn("flex justify-between items-start", "mt-3")}>
          <UserInfo
            data={viewingStory?.user}
            timestamp={currentStory.createdAt}
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
        key={currentStory.id} // Force re-render on content change to reset video
        content={currentStory.content}
        setVideoRef={handleSetVideoRef}
      />
      {((viewingStory?.stories.length ?? 0) > 1 || otherStories.length > 1) && (
        <NavigateButtons onNavigate={handleNavigate} />
      )}
    </Container>
  );
}
