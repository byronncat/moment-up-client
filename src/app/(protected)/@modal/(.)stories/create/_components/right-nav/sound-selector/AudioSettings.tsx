import { useRef, useState, useEffect, useMemo } from "react";
import { useCreateData } from "../../../_providers";
import { debounce } from "lodash";

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

  // Using useMemo to avoid re-creating the debounced function on every render
  // When a debounced function is recreated, it loses its internal timer state, which means it can't properly debounce the calls.
  const debouncedUpdateCurrentTime = useMemo(
    () =>
      debounce((time: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = time;
        setCurrentTime(time);
      }, DEBOUNCE_TIME),
    []
  );

  function handleTrimChange(start: number, end: number) {
    if (!uploadedAudio) return;

    const adjustedStart = Math.max(0, Math.min(start, end - TRIM_TIME_GAP));
    const adjustedEnd = Math.min(
      uploadedAudio.duration,
      Math.max(end, start + TRIM_TIME_GAP)
    );

    trimAudio(adjustedStart, adjustedEnd);
    debouncedUpdateCurrentTime(adjustedStart);
  }

  if (!uploadedAudio) return null;

  const trimDuration = uploadedAudio.trimEnd - uploadedAudio.trimStart;

  return (
    <div className={className}>
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

      <div className="bg-card-dark rounded-lg p-4 border border-accent-dark/20">
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
