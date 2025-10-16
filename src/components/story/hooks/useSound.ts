import type { StoryInfo } from "api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useSound(
  story: StoryInfo["stories"][number] | undefined,
  isPlaying: boolean,
  isActive: boolean
) {
  const haveSound = useMemo(() => {
    if (!story || !isActive) return false;

    if (typeof story?.content === "object" && story?.content?.type === "video")
      return true;

    return !!story.sound;
  }, [story, isActive]);
  const soundUrl = useMemo(() => story?.sound, [story]);

  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const setVideoRef = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
  }, []);

  const toggleSoundOn = useCallback(() => {
    setIsSoundOn((prev) => !prev);
  }, []);

  const toggleUrlSound = useCallback(() => {
    if (audioRef.current) {
      if (isSoundOn && isPlaying)
        audioRef.current.play().catch((error) => {
          if (error.name !== "AbortError")
            console.error("Failed to play audio:", error);
        });
      else audioRef.current.pause();
    }
  }, [isSoundOn, isPlaying]);

  const cleanUpAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;

    cleanUpAudio();
    if (soundUrl) audioRef.current = new Audio(soundUrl);

    return () => {
      cleanUpAudio();
    };
  }, [soundUrl, cleanUpAudio, isActive, story]);

  useEffect(() => {
    if (!isActive) return;

    toggleUrlSound();
  }, [soundUrl, isSoundOn, isPlaying, isActive, story, toggleUrlSound]);

  useEffect(() => {
    if (!isActive) return;

    if (videoRef.current) videoRef.current.muted = soundUrl ? true : !isSoundOn;
  }, [isSoundOn, soundUrl, videoRef, isActive, story]);

  return {
    haveSound,
    isSoundOn,
    toggleSoundOn,
    setVideoRef,
  };
}
