import { useAuth, useStory } from "@/components/providers";
import { usePathname } from "next/navigation";
import { CONTENT_REPORT_OPTIONS } from "@/constants/server";
import { REPORT_ICONS } from "@/constants/client";

import { cn } from "@/libraries/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
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
  const { deleteStory, muteStory, reportStory } = useStory();

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  function handleDelete() {
    deleteStory(storyId);
  }

  function handleMute() {
    muteStory(ownBy);
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
          className={cn(
            menuItemStyles,
            "destructive-item-dark focus:text-destructive-dark! focus:bg-destructive-dark/10!"
          )}
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className={cn(
                menuItemStyles,
                "destructive-item-dark focus:text-destructive-dark! focus:bg-destructive-dark/10!"
              )}
            >
              <Flag className="size-4" />
              <span>Report this story</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              sideOffset={8}
              className={cn(
                "w-60 bg-background-dark",
                "border border-border-dark shadow-xs",
                "text-foreground-dark"
              )}
            >
              {ReportStoryOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => reportStory(storyId, option.value)}
                  className={menuItemStyles}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </>
      )}
    </DropdownMenuContent>
  );
}

const ReportStoryOptions = CONTENT_REPORT_OPTIONS.map((option) => ({
  ...option,
  icon: REPORT_ICONS[option.value],
}));
