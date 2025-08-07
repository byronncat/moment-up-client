"use client";

import type { FeedInfo } from "api";

import { usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useContentProgress, useSound } from "./hooks";
import { useFeed } from "@/app/(protected)/@modal/(.)feeds/[username]/[id]/hooks/useFeedData";

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

type FeedViewProps = Readonly<{
  data: FeedInfo | undefined;
  loading: boolean;
  onClose: () => void;
  confirm?: boolean;
  initialIndex?: number;
  className?: string;
}>;

export default function FeedView({
  data,
  loading,
  onClose,
  confirm = false,
  initialIndex = 0,
  className,
}: FeedViewProps) {
  const pathname = usePathname();
  const { totalFeeds, navigateUser } = useFeed();

  const [currentFeedIndex, setCurrentFeedIndex] = useState(initialIndex);
  const [_confirm, setConfirm] = useState(confirm);

  const username = useMemo(() => {
    return pathname.split("/")[2];
  }, [pathname]);

  const changeUrl = useCallback(
    (index: number) => {
      if (username && data?.feeds[index].id) {
        const newUrl = ROUTE.FEED(username, data.feeds[index].id);
        window.history.replaceState(null, "", newUrl);
      }
    },
    [username, data?.feeds]
  );

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      const feedsLength = data?.feeds.length ?? 0;
      const isPrev = direction === "prev";
      const isNext = direction === "next";

      if (isPrev || isNext) {
        const offset = isPrev ? -1 : 1;
        const limit = isPrev ? 0 : feedsLength - 1;

        const atBoundary = isPrev
          ? currentFeedIndex <= limit
          : currentFeedIndex >= limit;

        if (!atBoundary) {
          const newIndex = currentFeedIndex + offset;
          setCurrentFeedIndex(newIndex);
          changeUrl(newIndex);
        } else {
          setCurrentFeedIndex(0);
          navigateUser(direction);
        }
      }
    },
    [data?.feeds, currentFeedIndex, navigateUser, changeUrl]
  );

  const handleSegmentClick = useCallback(
    (index: number) => {
      setCurrentFeedIndex(index);
      changeUrl(index);
    },
    [setCurrentFeedIndex, changeUrl]
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
    handleViewComplete,
    _confirm
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

  const handleConfirm = useCallback(() => {
    // Update currentFeedIndex when initialIndex changes (when data loads)
    setCurrentFeedIndex(initialIndex);
    setConfirm(true);
    play();
  }, [play, initialIndex]);

  useEffect(() => {
    if (username) reset();
  }, [username, reset]);

  if (!_confirm)
    return <ConfirmState onConfirm={handleConfirm} className={className} />;
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
