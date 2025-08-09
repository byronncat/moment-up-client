import type { StoryInfo } from "api";
import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_DURATION = 7000;
const UPDATE_INTERVAL = 50;

type ContentType = StoryInfo["stories"][number]["content"];

export function useContentProgress(
  content: ContentType | undefined,
  onComplete?: () => void,
  initialPlay = true
) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(initialPlay);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const calculateDuration = useCallback(() => {
    if (
      typeof content === "object" &&
      content?.type === "video" &&
      videoRef.current?.duration &&
      !isNaN(videoRef.current.duration)
    ) {
      return videoRef.current.duration * 1000;
    }
    return DEFAULT_DURATION;
  }, [content]);

  const handleLoadedMetadata = useCallback(() => {
    const newDuration = calculateDuration();
    setDuration(newDuration);
  }, [calculateDuration]);

  const setVideoRef = useCallback(
    (video: HTMLVideoElement | null) => {
      if (videoRef.current)
        videoRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );

      videoRef.current = video;

      if (video) {
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        if (video.duration && !isNaN(video.duration))
          setDuration(video.duration * 1000);
      }
    },
    [handleLoadedMetadata]
  );

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (videoRef.current) videoRef.current.pause();
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setIsPlaying(true);
    if (typeof content === "object" && content?.type === "video")
      setDuration(DEFAULT_DURATION);
  }, [content]);

  const play = useCallback(() => {
    setIsPlaying(true);
    if (videoRef.current) videoRef.current.play();
  }, []);

  useEffect(() => {
    if (!isPlaying || !content) return;
    const increment = 100 / (duration / UPDATE_INTERVAL);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onComplete?.(); // This will be called twice when complete
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }

        return prev + increment;
      });
    }, UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, duration, content, onComplete]);

  useEffect(() => {
    return () => {
      if (videoRef.current)
        videoRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
    };
  }, [handleLoadedMetadata]);

  useEffect(() => {
    if (typeof content === "object" && content?.type === "video")
      setDuration(DEFAULT_DURATION);
    else setDuration(DEFAULT_DURATION);
  }, [content]);

  return {
    progress,
    setVideoRef,
    reset,
    isPlaying,
    pause,
    play,
  };
}
