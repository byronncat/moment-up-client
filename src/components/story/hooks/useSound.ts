import type { StoryInfo } from "api";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSound(
  story: StoryInfo["stories"][number] | undefined,
  isPlaying: boolean,
  isActive: boolean
) {
  const haveSound = (() => {
    if (!story || !isActive) return false;

    if (typeof story.content === "object" && story.content?.type === "video")
      return true;

    return !!story.sound;
  })();
  const soundUrl = story?.sound;

  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  function setVideoRef(video: HTMLVideoElement | null) {
    videoRef.current = video;
  }

  function toggleSoundOn() {
    setIsSoundOn((prev) => !prev);
  }

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

  function cleanUpAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }

  useEffect(() => {
    if (!isActive) return;
    cleanUpAudio();
    if (soundUrl) audioRef.current = new Audio(soundUrl);

    return () => {
      cleanUpAudio();
    };
  }, [soundUrl, isActive, story]);

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
