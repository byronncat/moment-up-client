"use client";

import type { FeedInfo } from "api";

import { useState, useCallback, useEffect } from "react";
import { useContentProgress, useSound } from "./hooks";
import { useFeed } from "@/app/(private)/@modal/(.)feeds/[username]/[id]/hooks/useFeedData";

import { cn } from "@/libraries/utils";

import Container from "./Container";
import Content from "./Content";
import {
  LoadingState,
  ErrorState,
  ActionButtons,
  NavigateButtons,
  ProgressBar,
  UserInfo,
} from "./components";

type FeedViewProps = Readonly<{
  data: FeedInfo | undefined;
  initialIndex: number;
  loading: boolean;
  onClose: () => void;
  className?: string;
}>;

export default function FeedView({
  data,
  loading,
  onClose,
  className,
}: FeedViewProps) {
  const { totalFeeds, currentUser, navigateUser } = useFeed();
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      const feedsLength = data?.feeds.length ?? 0;

      if (direction === "prev") {
        if (currentFeedIndex > 0) setCurrentFeedIndex(currentFeedIndex - 1);
        else {
          setCurrentFeedIndex(0);
          navigateUser("prev");
        }
      } else {
        if (currentFeedIndex < feedsLength - 1)
          setCurrentFeedIndex(currentFeedIndex + 1);
        else {
          setCurrentFeedIndex(0);
          navigateUser("next");
        }
      }
    },
    [data?.feeds.length, currentFeedIndex, navigateUser]
  );

  const handleSegmentClick = useCallback(
    (index: number) => {
      setCurrentFeedIndex(index);
    },
    [setCurrentFeedIndex]
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
    data?.feeds[currentFeedIndex]?.content,
    handleViewComplete
  );

  const {
    haveSound,
    isSoundOn,
    toggleSoundOn,
    setVideoRef: setSoundVideoRef,
  } = useSound(data?.feeds[currentFeedIndex], isPlaying);

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

  useEffect(() => {
    if (currentUser) reset();
  }, [currentUser, reset]);

  if (loading) return <LoadingState className={className} />;
  if (!data?.feeds[currentFeedIndex])
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
          total={data.feeds.length}
          current={currentFeedIndex}
          progress={progress}
          onSegmentClick={(index) => {
            handleSegmentClick(index);
            reset();
          }}
        />
        <div className={cn("flex justify-between items-start", "mt-3")}>
          <UserInfo
            data={data.user}
            timestamp={data.feeds[currentFeedIndex].createdAt}
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
        key={data?.feeds[currentFeedIndex].id} // Force re-render on content change to reset video
        content={data?.feeds[currentFeedIndex].content}
        setVideoRef={handleSetVideoRef}
      />
      {(data.feeds.length > 1 || totalFeeds > 1) && (
        <NavigateButtons onNavigate={handleNavigate} />
      )}
    </Container>
  );
}
