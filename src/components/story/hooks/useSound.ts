import type { StoryInfo } from "api";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSound(
  story: StoryInfo["stories"][number] | undefined,
  isPlaying: boolean,
  shouldPlay: boolean,
  onLoadingComplete: () => void
) {
  const haveSound = (() => {
    if (!story || !shouldPlay) return false;

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
    cleanUpAudio();

    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audioRef.current = audio;

      function handleCanPlayThrough() {
        onLoadingComplete();
      }

      function handleError() {
        console.error("Failed to load audio:", audio.error);
      }

      // Listen for when audio can play through without buffering
      audio.addEventListener("canplaythrough", handleCanPlayThrough);
      audio.addEventListener("error", handleError);

      return () => {
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
        audio.removeEventListener("error", handleError);
        cleanUpAudio();
      };
    }

    return () => {
      cleanUpAudio();
    };
  }, [soundUrl, shouldPlay, story, onLoadingComplete]);

  useEffect(() => {
    if (!shouldPlay) return;
    toggleUrlSound();
  }, [soundUrl, isSoundOn, isPlaying, shouldPlay, story, toggleUrlSound]);

  useEffect(() => {
    if (story?.content?.type === "video") onLoadingComplete();
    if (videoRef.current) videoRef.current.muted = soundUrl ? true : !isSoundOn;
  }, [isSoundOn, soundUrl, shouldPlay, story, onLoadingComplete]);

  return {
    haveSound,
    isSoundOn,
    toggleSoundOn,
    setVideoRef,
  };
}
