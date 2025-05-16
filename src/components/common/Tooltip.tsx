"use client";

import { cn } from "@/libraries/utils";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tooltipStyles = {
  default: cn(
    "bg-gray-500 text-white dark:bg-zinc-800 dark:text-white",
    "text-xs",
    "px-2 py-1 rounded-md",
    "dark:border border-border",
    "shadow-md"
  ),
  borderless: cn(
    "bg-gray-500 text-white dark:bg-zinc-800 dark:text-white",
    "text-xs",
    "px-2 py-1 rounded-md",
    "border-none",
    "shadow-md"
  ),
};

type TooltipProps = ComponentProps<{
  content: React.ReactNode;
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  variant?: "default" | "borderless";
  align?: "start" | "center" | "end";
}>;

export default function Tooltip({
  children,
  content,
  sideOffset = 6,
  side,
  variant = "default",
  align,
  className,
}: TooltipProps) {
  return (
    <TooltipUI>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className={cn(tooltipStyles[variant], className)}
        sideOffset={sideOffset}
        side={side}
        align={align}
      >
        {typeof content === "string" ? <p>{content}</p> : content}
      </TooltipContent>
    </TooltipUI>
  );
}
