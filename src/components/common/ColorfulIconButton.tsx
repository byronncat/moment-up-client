import { cn } from "@/libraries/utils";
import format from "@/utilities/format";

import Tooltip from "./Tooltip";

type ColorfulIconButtonProps = {
  icon: React.ReactNode;
  color: string;
  tooltip: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
};

export const buttonStyles = {
  iconSize: "size-5",
  transition: "transition-colors duration-150 ease-in-out",
};

export default function ColorfulIconButton({
  icon,
  color,
  count,
  tooltip,
  isActive = false,
  onClick,
}: ColorfulIconButtonProps) {
  let textClass = "";
  let hoverTextClass = "";
  let bgHoverClass = "";
  switch (color) {
    case "pink-500":
      textClass = "text-pink-500";
      hoverTextClass = "hover:text-pink-500 dark:hover:text-pink-400";
      bgHoverClass =
        "group-hover:bg-pink-500/10 dark:group-hover:bg-pink-400/10";
      break;
    case "sky-500":
      textClass = "text-sky-500";
      hoverTextClass = "hover:text-sky-500 dark:hover:text-sky-400";
      bgHoverClass = "group-hover:bg-sky-500/10 dark:group-hover:bg-sky-400/10";
      break;
    case "green-500":
      textClass = "text-green-500";
      hoverTextClass = "hover:text-green-500 dark:hover:text-green-400";
      bgHoverClass =
        "group-hover:bg-green-500/10 dark:group-hover:bg-green-400/10";
      break;
    case "yellow-500":
      textClass = "text-yellow-500";
      hoverTextClass = "hover:text-yellow-500 dark:hover:text-yellow-400";
      bgHoverClass =
        "group-hover:bg-yellow-500/10 dark:group-hover:bg-yellow-400/10";
      break;
    case "blue-500":
      textClass = "text-blue-500";
      hoverTextClass = "hover:text-blue-500 dark:hover:text-blue-400";
      bgHoverClass =
        "group-hover:bg-blue-500/10 dark:group-hover:bg-blue-400/10";
      break;
    default:
      textClass = "";
      hoverTextClass = "";
      bgHoverClass = "";
  }

  return (
    <Tooltip content={tooltip} sideOffset={6}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex items-center gap-1",
          isActive ? textClass : hoverTextClass,
          "cursor-pointer",
          buttonStyles.transition
        )}
      >
        <div
          className={cn(
            "p-2 rounded-full",
            bgHoverClass,
            buttonStyles.transition
          )}
        >
          {icon}
        </div>
        {count && <span>{format.number(count)}</span>}
      </button>
    </Tooltip>
  );
}
