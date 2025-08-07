import type { FeedInfo } from "api";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";

export function useSound(
  feed: FeedInfo["feeds"][number] | undefined,
  isPlaying: boolean
) {
  const haveSound = useMemo(() => {
    if (!feed) return false;

    if (typeof feed?.content === "object" && feed?.content?.type === "video")
      return true;

    return !!feed.sound;
  }, [feed]);
  const soundUrl = useMemo(() => feed?.sound, [feed]);

  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const setVideoRef = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
  }, []);

  const toggleSoundOn = useCallback(() => {
    setIsSoundOn((prev) => !prev);
  }, []);

  const cleanUpAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    cleanUpAudio();
    if (soundUrl) audioRef.current = new Audio(soundUrl);

    return () => {
      cleanUpAudio();
    };
  }, [soundUrl, cleanUpAudio]);

  useEffect(() => {
    if (audioRef.current) {
      if (isSoundOn && isPlaying)
        audioRef.current.play().catch((error) => {
          if (error.name !== "AbortError")
            console.error("Failed to play audio:", error);
        });
      else audioRef.current.pause();
    }
  }, [soundUrl, isSoundOn, isPlaying]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = soundUrl ? true : !isSoundOn;
  }, [isSoundOn, soundUrl, videoRef]);

  return {
    haveSound,
    isSoundOn,
    toggleSoundOn,
    setVideoRef,
  };
}
