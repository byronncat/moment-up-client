import { cn } from "@/libraries/utils";
import { formatTime } from "./utilities";
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
  const handleSliderChange = (values: number[]) => {
    const [start, end] = values;
    onTrimChange(start, end);
  };

  const sliderValues = [trimStart, trimEnd];
  return (
    <div className={cn("space-y-3", className)}>
      <div className="text-xs font-medium text-muted-foreground-dark">
        Trimming
      </div>

      <div className="space-y-4">
        <div>
          <Slider
            value={sliderValues}
            onValueChange={handleSliderChange}
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
            <span>Start: {formatTime(trimStart)}</span>
            <span>End: {formatTime(trimEnd)}</span>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <TimeInput
            value={trimStart}
            label="Start (s)"
            type="increment"
            min={0}
            max={trimEnd}
            onChange={(value) => {
              onTrimChange(value, trimEnd);
            }}
          />

          <TimeInput
            value={trimEnd}
            label="End (s)"
            type="decrement"
            min={trimStart}
            max={duration}
            onChange={(value) => {
              onTrimChange(trimStart, value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

const TIME_INPUT_STEP = 0.1;

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
      <label className="block text-xs text-muted-foreground-dark mb-1">
        {label}
      </label>
      <Input
        type="number"
        value={value.toFixed(1)}
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
          "h-8 bg-muted-dark",
          "border-border-dark",
          "focus-visible:ring-accent-dark/50 focus-visible:border-accent-dark/50 focus-visible:ring-0.5"
        )}
      />
    </div>
  );
}
