import { useAuth, useStory } from "@/components/providers";
import { usePathname } from "next/navigation";

import { cn } from "@/libraries/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bug,
  Flag,
  Link,
  MoreHorizontal,
  Pause,
  Play,
  Trash,
  Volume,
} from "@/components/icons";
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

const menuItemStyles = cn(
  "flex items-center gap-2",
  "cursor-pointer",
  "focus:text-foreground-dark! focus:bg-accent-dark/7!"
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
      <MenuContent isMe={isMe} storyId={storyId} ownBy={ownBy} />
    </DropdownMenu>
  );
}

type MenuContentProps = Readonly<{
  isMe: boolean;
  storyId: string;
  ownBy: string;
}>;

function MenuContent({ isMe, storyId, ownBy }: MenuContentProps) {
  const { deleteStory, muteStory } = useStory();

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  function handleDelete() {
    deleteStory(storyId);
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
    <DropdownMenuContent
      align="end"
      sideOffset={12}
      disablePortal
      className={cn(
        "w-64 bg-background-dark",
        "border border-border-dark shadow-xs",
        "text-foreground-dark"
      )}
    >
      <DropdownMenuItem onClick={handleCopyLink} className={menuItemStyles}>
        <Link className="size-4" />
        <span>Copy link to share this story</span>
      </DropdownMenuItem>

      {isMe ? (
        <DropdownMenuItem
          onClick={handleDelete}
          className={cn(menuItemStyles, "destructive-item-dark focus:text-destructive-dark! focus:bg-destructive-dark/10!")}
        >
          <Trash className="size-4" />
          <span>Delete story</span>
        </DropdownMenuItem>
      ) : (
        <>
          <DropdownMenuItem onClick={handleMute} className={menuItemStyles}>
            <Volume className="size-4" />
            <span>Mute @{ownBy}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleReport}
            className={cn(
              menuItemStyles,
              "destructive-item-dark focus:text-destructive-dark! focus:bg-destructive-dark/10!"
            )}
            disabled
          >
            <Flag className="size-4" />
            <span>Report this story</span>
          </DropdownMenuItem>
        </>
      )}

      <DropdownMenuItem onClick={handleBug} className={menuItemStyles} disabled>
        <Bug className="size-4" />
        <span>Something isn&apos;t working</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
