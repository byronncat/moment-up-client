import { cn } from "@/libraries/utils";
import { Pause, Play, Volume } from "@/components/icons";

type ActionButtonsProps = Readonly<{
  isPlaying: boolean;
  isSoundOn: boolean | null;
  onPlay: () => void;
  onPause: () => void;
  onSoundToggle: () => void;
  className?: string;
}>;

export default function ActionButtons({
  isPlaying,
  isSoundOn,
  onPlay,
  onPause,
  onSoundToggle,
  className,
}: ActionButtonsProps) {
  return (
    <div
      className={cn(
        className,
        "flex items-center gap-2",
        "text-white fill-white"
      )}
    >
      <button
        onClick={onSoundToggle}
        disabled={isSoundOn === null}
        aria-label={
          isSoundOn === null
            ? "No sound"
            : isSoundOn
              ? "Mute sound"
              : "Unmute sound"
        }
      >
        <Volume
          variant={isSoundOn === null ? "x" : isSoundOn ? "regular" : "off"}
          className={cn("size-6")}
        />
      </button>
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="w-6 flex items-center justify-center"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="size-6" /> : <Play className="size-5" />}
      </button>
    </div>
  );
}
