import { useAuth, useStory } from "@/components/providers";
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
  Bug,
  Flag,
} from "@/components/icons";
import { styles } from "@/constants/clientConfig";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/common/Tooltip";

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

const menuItemStyles = cn("flex items-center gap-2", "cursor-pointer");

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
      <Tooltip
        content={
          isSoundOn === null
            ? "No sound"
            : isSoundOn
              ? "Mute sound"
              : "Unmute sound"
        }
        variant="borderless"
        side="bottom"
        sideOffset={12}
        dark
      >
        <button
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
      </Tooltip>
      <Tooltip
        content={isPlaying ? "Pause" : "Play"}
        variant="borderless"
        side="bottom"
        sideOffset={12}
        dark
      >
        <button
          onClick={isPlaying ? onPause : onPlay}
          className={buttonStyles}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="size-6" />
          ) : (
            <Play className="size-5" />
          )}
        </button>
      </Tooltip>
      <MoreMenu />
    </div>
  );
}

function MoreMenu() {
  const { user } = useAuth();
  const pathname = usePathname();

  const storyId = pathname.split("/").pop() as string;
  const ownBy = pathname.split("/").at(-2) as string;
  const isMe = user?.username === ownBy;

  return (
    <DropdownMenu>
      <Tooltip
        content="More options"
        variant="borderless"
        side="bottom"
        sideOffset={12}
        dark
      >
        <DropdownMenuTrigger asChild>
          <button className={buttonStyles} aria-label="More">
            <MoreHorizontal className="size-6" />
          </button>
        </DropdownMenuTrigger>
      </Tooltip>
      {isMe ? (
        <MyMenuContent storyId={storyId} />
      ) : (
        <OtherMenuContent ownBy={ownBy} />
      )}
    </DropdownMenu>
  );
}

type MyMenuContentProps = Readonly<{
  storyId: string;
}>;

function MyMenuContent({ storyId }: MyMenuContentProps) {
  const { deleteStory } = useStory();

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  function handleDelete() {
    deleteStory(storyId);
  }

  function handleBug() {
    // TODO: Implement this feature
    console.warn("This feature is not implemented yet");
  }

  return (
    <DropdownMenuContent align="end" className="w-64" sideOffset={12}>
      <DropdownMenuItem onClick={handleCopyLink} className={menuItemStyles}>
        <Link className="size-4" />
        <span>Copy link to share this story</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={handleDelete}
        className={cn(menuItemStyles, styles.destructiveDropdownMenuItem)}
      >
        <Trash className="size-4" />
        <span>Delete story</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleBug} className={menuItemStyles} disabled>
        <Bug className="size-4" />
        <span>Something isn&apos;t working</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function OtherMenuContent({ ownBy }: Readonly<{ ownBy: string }>) {
  const { muteStory } = useStory();
  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  function handleMute() {
    muteStory(ownBy);
  }

  function handleReport() {
    // TODO: Implement this feature
    console.warn("This feature is not implemented yet");
  }

  function handleBug() {
    // TODO: Implement this feature
    console.warn("This feature is not implemented yet");
  }

  return (
    <DropdownMenuContent align="end" className="w-64" sideOffset={12}>
      <DropdownMenuItem onClick={handleCopyLink} className={menuItemStyles}>
        <Link className="size-4" />
        <span>Copy link to share this story</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleMute} className={menuItemStyles}>
        <Volume className="size-4" />
        <span>Mute @{ownBy}</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={handleReport}
        className={cn(menuItemStyles, styles.destructiveDropdownMenuItem)}
        disabled
      >
        <Flag className="size-4" />
        <span>Report this story</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleBug} className={menuItemStyles} disabled>
        <Bug className="size-4" />
        <span>Something isn&apos;t working</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
