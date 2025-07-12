import Format from "@/utilities/format";
import { cn } from "@/libraries/utils";
import Tooltip from "./Tooltip";

export const buttonStyles = {
  iconSize: "size-5",
  transition: "transition-colors duration-150 ease-in-out",
};

const colorVariants = {
  pink: {
    text: "text-pink-500",
    hover: "hover:text-pink-500 dark:hover:text-pink-400",
    bg: "group-hover:bg-pink-500/10 dark:group-hover:bg-pink-400/10",
  },
  sky: {
    text: "text-sky-500",
    hover: "hover:text-sky-500 dark:hover:text-sky-400",
    bg: "group-hover:bg-sky-500/10 dark:group-hover:bg-sky-400/10",
  },
  green: {
    text: "text-green-500",
    hover: "hover:text-green-500 dark:hover:text-green-400",
    bg: "group-hover:bg-green-500/10 dark:group-hover:bg-green-400/10",
  },
  yellow: {
    text: "text-yellow-500",
    hover: "hover:text-yellow-500 dark:hover:text-yellow-400",
    bg: "group-hover:bg-yellow-500/10 dark:group-hover:bg-yellow-400/10",
  },
  blue: {
    text: "text-blue-500",
    hover: "hover:text-blue-500 dark:hover:text-blue-400",
    bg: "group-hover:bg-blue-500/10 dark:group-hover:bg-blue-400/10",
  },
} as const;

type ColorfulIconButtonProps = {
  icon: React.ReactNode;
  color: "pink" | "sky" | "green" | "yellow" | "blue";
  tooltip: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
};

export default function ColorfulIconButton({
  icon,
  color,
  count,
  tooltip,
  isActive = false,
  onClick,
}: ColorfulIconButtonProps) {
  const variant = colorVariants[color];
  return (
    <Tooltip content={tooltip} sideOffset={6}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex items-center gap-1",
          isActive ? variant.text : variant.hover,
          "cursor-pointer",
          buttonStyles.transition
        )}
      >
        <div
          className={cn(
            "p-2 rounded-full",
            variant.bg,
            buttonStyles.transition
          )}
        >
          {icon}
        </div>
        {count !== undefined && <span>{Format.number(count)}</span>}
      </button>
    </Tooltip>
  );
}
