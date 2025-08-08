import { cn } from "@/libraries/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pause,
  Play,
  Volume,
  MoreHorizontal,
  Link,
  Trash,
  TriangleAlert,
} from "@/components/icons";
// import { styles } from "@/constants/clientConfig";

type ActionButtonsProps = Readonly<{
  isPlaying: boolean;
  isSoundOn: boolean | null;
  onPlay: () => void;
  onPause: () => void;
  onSoundToggle: () => void;
  className?: string;
}>;

const buttonStyles = cn(
  "size-6 flex items-center justify-center",
  "text-white fill-white",
  "cursor-pointer"
);

export default function ActionButtons({
  isPlaying,
  isSoundOn,
  onPlay,
  onPause,
  onSoundToggle,
  className,
}: ActionButtonsProps) {
  return (
    <div className={cn(className, "flex items-center gap-2")}>
      <button
        type="button"
        onClick={onSoundToggle}
        disabled={isSoundOn === null}
        className={buttonStyles}
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
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        className={buttonStyles}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="size-6" /> : <Play className="size-5" />}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={buttonStyles} aria-label="More">
            <MoreHorizontal className="size-6" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem
            className={cn("flex items-center gap-2", "cursor-pointer")}
          >
            <Link className="size-4" />
            <span>Copy link to share this story</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "flex items-center gap-2",
              "cursor-pointer",
              // styles.destructiveDropdownMenuItem
            )}
          >
            <Trash className="size-4" />
            <span>Delete photo</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn("flex items-center gap-2", "cursor-pointer")}
          >
            <TriangleAlert className="size-4" />
            <span>Something isn&apos;t working</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

