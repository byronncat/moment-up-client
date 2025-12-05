import { useState } from "react";
import { formatTime } from "./utilities";
import { cn } from "@/libraries/utils";
import { Pause, Play } from "@/components/icons";
import { Slider } from "@/components/ui/slider";

type PlayControlsProps = Readonly<{
  isPlaying: boolean;
  currentTime: number;
  trimDuration: number;
  trimStart: number;
  handlePlayPause: () => void;
  handleSeek: (time: number) => void;
  className?: string;
}>;

export default function PlayControls({
  isPlaying,
  currentTime,
  trimDuration,
  trimStart,
  handlePlayPause,
  handleSeek,
  className,
}: PlayControlsProps) {
  const [sliderValue, setSliderValue] = useState<number[] | null>(null);

  function handleSliderCommit(values: number[]) {
    const newTime = values[0];
    const actualTime = trimStart + (newTime / 100) * trimDuration;
    handleSeek(actualTime);
    setSliderValue(null);
  }

  const displayValue =
    sliderValue ??
    (trimDuration > 0
      ? [((currentTime - trimStart) / trimDuration) * 100]
      : [0]);

  const displayTime =
    sliderValue !== null
      ? trimStart + (sliderValue[0] / 100) * trimDuration
      : currentTime;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        onClick={handlePlayPause}
        className={cn(
          "p-2 rounded-full bg-accent-dark hover:bg-accent-dark/80",
          "text-black transition-colors"
        )}
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>

      <div className="flex-1">
        <div className="text-xs text-muted-foreground-dark mb-1">
          {formatTime(Math.max(0, displayTime - trimStart))} /{" "}
          {formatTime(trimDuration)}
        </div>
        <Slider
          value={displayValue}
          onValueChange={setSliderValue}
          onValueCommit={handleSliderCommit}
          max={100}
          min={0}
          step={0.1}
          className="w-full"
          trackClassName="bg-muted-dark"
          rangeClassName="bg-accent-dark"
          thumbClassName="bg-accent-dark border-border-dark"
        />
      </div>
    </div>
  );
}
