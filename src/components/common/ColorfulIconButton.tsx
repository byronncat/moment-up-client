import Format from "@/utilities/format";
import { cn } from "@/libraries/utils";
import Tooltip from "./Tooltip";

export const buttonStyles = {
  iconSize: "size-4 mobile:size-5",
  transition: "transition-colors duration-75 ease-in-out",
};

const colorVariants = {
  pink: {
    text: "text-pink-500",
    hover: "hover:text-pink-500 dark:hover:text-pink-400",
    bg: "group-hover:bg-pink-500/10 dark:group-hover:bg-pink-400/10 group-focus-within:bg-pink-500/10 dark:group-focus-within:bg-pink-400/10",
    focus: "focus-within:text-pink-500 dark:focus-within:text-pink-400",
  },
  sky: {
    text: "text-sky-500",
    hover: "hover:text-sky-500 dark:hover:text-sky-400",
    bg: "group-hover:bg-sky-500/10 dark:group-hover:bg-sky-400/10 group-focus-within:bg-sky-500/10 dark:group-focus-within:bg-sky-400/10",
    focus: "focus-within:text-sky-500 dark:focus-within:text-sky-400",
  },
  green: {
    text: "text-green-500",
    hover: "hover:text-green-500 dark:hover:text-green-400",
    bg: "group-hover:bg-green-500/10 dark:group-hover:bg-green-400/10 group-focus-within:bg-green-500/10 dark:group-focus-within:bg-green-400/10",
    focus: "focus-within:text-green-500 dark:focus-within:text-green-400",
  },
  yellow: {
    text: "text-yellow-500",
    hover: "hover:text-yellow-500 dark:hover:text-yellow-400",
    bg: "group-hover:bg-yellow-500/10 dark:group-hover:bg-yellow-400/10 group-focus-within:bg-yellow-500/10 dark:group-focus-within:bg-yellow-400/10",
    focus: "focus-within:text-yellow-500 dark:focus-within:text-yellow-400",
  },
  blue: {
    text: "text-blue-500",
    hover: "hover:text-blue-500 dark:hover:text-blue-400",
    bg: "group-hover:bg-blue-500/10 dark:group-hover:bg-blue-400/10 group-focus-within:bg-blue-500/10 dark:group-focus-within:bg-blue-400/10",
    focus: "focus-within:text-blue-500 dark:focus-within:text-blue-400",
  },
} as const;

type ColorfulIconButtonProps = {
  icon: React.ReactNode;
  color: "pink" | "sky" | "green" | "yellow" | "blue";
  tooltip: string;
  count?: number;
  emptyText?: string;
  isActive?: boolean;
  onClick?: () => void;
};

export default function ColorfulIconButton({
  icon,
  color,
  count,
  tooltip,
  isActive = false,
  emptyText,
  onClick,
}: ColorfulIconButtonProps) {
  const variant = colorVariants[color];
  return (
    <Tooltip content={tooltip} sideOffset={6}>
      <button
        onClick={onClick}
        className={cn(
          "group flex items-center gap-1",
          "cursor-pointer outline-none",
          isActive ? variant.text : variant.hover,
          variant.focus,
          buttonStyles.transition
        )}
      >
        <span
          className={cn(
            "size-9 flex items-center justify-center rounded-full",
            variant.bg,
            buttonStyles.transition
          )}
        >
          {icon}
        </span>
        {count !== undefined ? (
          count > 0 ? (
            <span className="text-xs mobile:text-sm">{Format.number(count)}</span>
          ) : (
            <span
              className={cn(
                "text-xs mobile:text-sm",
                "hidden mobile:inline-block",
                variant.focus
              )}
            >
              {emptyText}
            </span>
          )
        ) : null}
      </button>
    </Tooltip>
  );
}
