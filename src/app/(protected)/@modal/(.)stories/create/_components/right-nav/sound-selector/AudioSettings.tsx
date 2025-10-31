import { useEffect, useRef, useState } from "react";
import { useCreateData } from "../../../_providers";
import { debounce } from "lodash";

import { cn } from "@/libraries/utils";
import AudioInfo from "./AudioInfo";
import PlayControls from "./PlayControls";
import TrimControls from "./TrimControls";

const TRIM_TIME_GAP = 1;
const DEBOUNCE_TIME = 500;

type AudioSettingsProps = Readonly<{
  className?: string;
}>;

export default function AudioSettings({ className }: AudioSettingsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const { uploadedAudio, trimAudio, removeAudio } = useCreateData();

  // Store the debounced function in a ref to avoid recreating it on every render
  const debouncedUpdateCurrentTimeRef = useRef(
    debounce(
      (
        time: number,
        audioEl: HTMLAudioElement,
        setTime: (time: number) => void
      ) => {
        audioEl.currentTime = time;
        setTime(time);
      },
      DEBOUNCE_TIME
    )
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (isPlaying && uploadedAudio) {
        audio.currentTime = uploadedAudio.trimStart;
        audio.play();
      } else setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [uploadedAudio, isPlaying]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    const debouncedFn = debouncedUpdateCurrentTimeRef.current;
    return () => {
      debouncedFn.cancel();
    };
  }, []);

  function handleRemoveAudio() {
    setIsPlaying(false);
    setCurrentTime(0);
    removeAudio();
  }

  function handlePlayPause() {
    const audio = audioRef.current;
    if (!audio || !uploadedAudio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }

  function handleSeek(time: number) {
    const audio = audioRef.current;
    if (!audio || !uploadedAudio) return;
    const seekTime = Math.max(
      uploadedAudio.trimStart,
      Math.min(time, uploadedAudio.trimEnd)
    );

    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  }

  function handleTrimChange(start: number, end: number) {
    if (!uploadedAudio || !audioRef.current) return;

    const adjustedStart = Math.max(0, Math.min(start, end - TRIM_TIME_GAP));
    const adjustedEnd = Math.min(
      uploadedAudio.duration,
      Math.max(end, start + TRIM_TIME_GAP)
    );

    trimAudio(adjustedStart, adjustedEnd);
    debouncedUpdateCurrentTimeRef.current(
      adjustedStart,
      audioRef.current,
      setCurrentTime
    );
  }

  if (!uploadedAudio) return null;

  const trimDuration = uploadedAudio.trimEnd - uploadedAudio.trimStart;

  return (
    <div>
      <audio
        ref={audioRef}
        src={uploadedAudio.preview}
        autoPlay={isPlaying}
        onTimeUpdate={() => {
          const audio = audioRef.current;
          if (audio && audio.currentTime >= uploadedAudio.trimEnd) {
            audio.currentTime = uploadedAudio.trimStart;
            if (!isPlaying) audio.pause();
          }
        }}
      />

      <div
        className={cn(
          "rounded-lg p-4",
          "border border-accent-dark/20",
          className
        )}
      >
        <AudioInfo
          name={uploadedAudio.file.name}
          size={uploadedAudio.file.size}
          handleRemoveAudio={handleRemoveAudio}
        />

        <PlayControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          trimDuration={trimDuration}
          trimStart={uploadedAudio.trimStart}
          handlePlayPause={handlePlayPause}
          handleSeek={handleSeek}
          className="mb-5"
        />

        <TrimControls
          trimStart={uploadedAudio.trimStart}
          trimEnd={uploadedAudio.trimEnd}
          duration={uploadedAudio.duration}
          onTrimChange={handleTrimChange}
        />
      </div>
    </div>
  );
}
