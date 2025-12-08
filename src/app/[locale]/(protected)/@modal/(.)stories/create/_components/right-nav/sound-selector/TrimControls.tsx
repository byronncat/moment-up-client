import { useState } from "react";
import { formatTime } from "./utilities";
import { debounce } from "lodash";

import { cn } from "@/libraries/utils";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

type TrimControlsProps = Readonly<{
  trimStart: number;
  trimEnd: number;
  duration: number;
  onTrimChange: (start: number, end: number) => void;
  className?: string;
}>;

export default function TrimControls({
  trimStart,
  trimEnd,
  duration,
  onTrimChange,
  className,
}: TrimControlsProps) {
  const [sliderValue, setSliderValue] = useState([trimStart, trimEnd]);

  function handleSliderCommit(values: number[]) {
    const [start, end] = values;
    onTrimChange(start, end);
  }

  const debouncedOnTrimChange = debounce((start: number, end: number) => {
    onTrimChange(start, end);
  }, 500);

  function handleTimeInputChange(start: number, end: number) {
    debouncedOnTrimChange(start, end);
    setSliderValue([Math.max(0, start), Math.min(duration, end)]);
  }

  const [startTime, endTime] = sliderValue;
  return (
    <div className={cn("space-y-3", className)}>
      <div className="text-xs text-muted-foreground-dark">Trimming</div>

      <div className="space-y-4">
        <div>
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            onValueCommit={handleSliderCommit}
            min={0}
            max={duration}
            step={0.1}
            className="w-full"
            trackClassName="bg-muted-dark h-3"
            rangeClassName="bg-accent-dark/50"
            thumbClassName={cn("bg-accent-dark border-border-dark", "h-5 w-2")}
          />

          <div
            className={cn(
              "mt-2.5",
              "flex justify-between",
              "text-xs text-muted-foreground-dark"
            )}
          >
            <span>Start: {formatTime(startTime)}</span>
            <span>End: {formatTime(endTime)}</span>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <TimeInput
            value={startTime}
            label="Start (s)"
            type="increment"
            min={0}
            max={endTime}
            onChange={(value) => handleTimeInputChange(value, trimEnd)}
          />

          <TimeInput
            value={endTime}
            label="End (s)"
            type="decrement"
            min={startTime}
            max={duration}
            onChange={(value) => handleTimeInputChange(trimStart, value)}
          />
        </div>
      </div>
    </div>
  );
}

const TIME_INPUT_STEP = 0.01;

type TimeInputProps = Readonly<{
  value: number;
  label: string;
  type: "increment" | "decrement";
  min: number;
  max: number;
  className?: string;
  onChange: (value: number) => void;
}>;
function TimeInput({ value, label, type, min, max, onChange }: TimeInputProps) {
  return (
    <div className="flex-1">
      <label
        className="block text-xs text-muted-foreground-dark mb-1"
        htmlFor={label}
      >
        {label}
      </label>
      <Input
        id={label}
        type="number"
        value={value.toFixed(2)}
        onChange={(event) => {
          const newValue = parseFloat(event.target.value) || 0;

          if (type === "increment") {
            const clampedStart = Math.max(
              0,
              Math.min(newValue, max - TIME_INPUT_STEP)
            );
            onChange(clampedStart);
          } else {
            const clampedEnd = Math.min(
              max,
              Math.max(newValue, min + TIME_INPUT_STEP)
            );
            onChange(clampedEnd);
          }
        }}
        min={min}
        max={max}
        step={TIME_INPUT_STEP}
        className={cn(
          "text-xs text-foreground-dark",
          "h-8 bg-input-dark",
          "border-border-dark"
        )}
      />
    </div>
  );
}
