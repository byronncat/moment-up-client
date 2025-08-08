"use client";

import type { StoryInfo } from "api";

import { usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useContentProgress, useSound } from "./hooks";
import { useStory } from "@/app/(protected)/@modal/(.)stories/[username]/[id]/hooks/useStoryData";

import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/route";

import Container from "./Container";
import Content from "./Content";
import { ConfirmState, LoadingState, ErrorState } from "./state";
import {
  ActionButtons,
  NavigateButtons,
  ProgressBar,
  UserInfo,
} from "./controls";

type StoryViewProps = Readonly<{
  data: StoryInfo | undefined;
  loading: boolean;
  onClose: () => void;
  confirm?: boolean;
  initialIndex?: number;
  className?: string;
}>;

export default function StoryView({
  data,
  loading,
  onClose,
  confirm = false,
  initialIndex = 0,
  className,
}: StoryViewProps) {
  const pathname = usePathname();
  const { totalStories, navigateUser } = useStory();

  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [_confirm, setConfirm] = useState(confirm);

  const username = useMemo(() => {
    return pathname.split("/")[2];
  }, [pathname]);

  const changeUrl = useCallback(
    (index: number) => {
      if (username && data?.stories[index].id) {
        const newUrl = ROUTE.STORY(username, data.stories[index].id);
        window.history.replaceState(null, "", newUrl);
      }
    },
    [username, data?.stories]
  );

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      const storiesLength = data?.stories.length ?? 0;
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
          changeUrl(newIndex);
        } else {
          setCurrentStoryIndex(0);
          navigateUser(direction);
        }
      }
    },
    [data?.stories, currentStoryIndex, navigateUser, changeUrl]
  );

  const handleSegmentClick = useCallback(
    (index: number) => {
      setCurrentStoryIndex(index);
      changeUrl(index);
    },
    [setCurrentStoryIndex, changeUrl]
  );

  const handleViewComplete = useCallback(() => {
    navigate("next");
  }, [navigate]);

  const {
    isPlaying,
    progress,
    pause,
    play,
    reset,
    setVideoRef: setContentVideoRef,
  } = useContentProgress(
    data?.stories[currentStoryIndex]?.content,
    handleViewComplete,
    _confirm
  );

  const {
    haveSound,
    isSoundOn,
    toggleSoundOn,
    setVideoRef: setSoundVideoRef,
  } = useSound(data?.stories[currentStoryIndex], isPlaying, _confirm);

  const handleSetVideoRef = useCallback(
    (video: HTMLVideoElement | null) => {
      setContentVideoRef(video);
      setSoundVideoRef(video);
    },
    [setContentVideoRef, setSoundVideoRef]
  );

  const handleNavigate = useCallback(
    (direction: "next" | "prev") => {
      navigate(direction);
      reset();
    },
    [navigate, reset]
  );

  const handleConfirm = useCallback(() => {
    // Update currentStoryIndex when initialIndex changes (when data loads)
    setCurrentStoryIndex(initialIndex);
    setConfirm(true);
    play();
  }, [play, initialIndex]);

  useEffect(() => {
    if (username) reset();
  }, [username, reset]);

  if (!_confirm)
    return <ConfirmState onConfirm={handleConfirm} className={className} />;
  if (loading) return <LoadingState className={className} />;
  if (!data?.stories[currentStoryIndex])
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
          total={data.stories.length}
          current={currentStoryIndex}
          progress={progress}
          onSegmentClick={(index) => {
            handleSegmentClick(index);
            reset();
          }}
        />
        <div className={cn("flex justify-between items-start", "mt-3")}>
          <UserInfo
            data={data.user}
            timestamp={data.stories[currentStoryIndex].createdAt}
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
        key={data?.stories[currentStoryIndex].id} // Force re-render on content change to reset video
        content={data?.stories[currentStoryIndex].content}
        setVideoRef={handleSetVideoRef}
      />
      {(data.stories.length > 1 || totalStories > 1) && (
        <NavigateButtons onNavigate={handleNavigate} />
      )}
    </Container>
  );
}
