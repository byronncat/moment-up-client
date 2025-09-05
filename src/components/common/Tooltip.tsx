"use client";

import { cn } from "@/libraries/utils";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip as TooltipUI,
} from "@/components/ui/tooltip";

const tooltipStyles = (forceDark: boolean) => ({
  default: cn(
    forceDark
      ? "bg-zinc-800 text-white"
      : "bg-gray-500 text-white dark:bg-zinc-800 dark:text-white",
    forceDark ? "border border-border" : "dark:border border-border",
    "text-xs",
    "px-2 py-1 rounded-md",
    "shadow-md"
  ),
  borderless: cn(
    forceDark
      ? "bg-zinc-800 text-white"
      : "bg-gray-500 text-white dark:bg-zinc-800 dark:text-white",
    "text-xs",
    "px-2 py-1 rounded-md",
    "border-none",
    "shadow-md"
  ),
});

type TooltipProps = Readonly<{
  children: React.ReactNode;
  content: React.ReactNode;
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  variant?: "default" | "borderless";
  align?: "start" | "center" | "end";
  dark?: boolean;
  className?: string;
}>;

export default function Tooltip({
  children,
  content,
  sideOffset = 0,
  side,
  variant = "default",
  align,
  dark: forceDark = false,
  className,
}: TooltipProps) {
  return (
    <TooltipUI>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className={cn(tooltipStyles(forceDark)[variant], className)}
        sideOffset={sideOffset}
        side={side}
        align={align}
      >
        {typeof content === "string" ? <p>{content}</p> : content}
      </TooltipContent>
    </TooltipUI>
  );
}
