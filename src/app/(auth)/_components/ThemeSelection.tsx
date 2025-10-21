"use client";

import { useTheme } from "next-themes";
import { useIsClient } from "usehooks-ts";

import { cn } from "@/libraries/utils";
import { Tooltip } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LaptopMinimal, Moon, Sun } from "@/components/icons";

type ThemeSelectionProps = Readonly<{
  children?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  asChild?: boolean;
  showTooltip?: boolean;
  className?: string;
}>;

export default function ThemeSelection({
  children,
  side = "bottom",
  sideOffset = 4,
  asChild,
  showTooltip = true,
  className,
}: ThemeSelectionProps) {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  const Options = [
    {
      label: "Light",
      icon: <Sun type="regular" className="size-5" />,
      selected: theme === "light",
      onClick: () => setTheme("light"),
    },
    {
      label: "Dark",
      icon: <Moon type="regular" className="size-5" />,
      selected: theme === "dark",
      onClick: () => setTheme("dark"),
    },
    {
      label: "System",
      icon: <LaptopMinimal className="size-5" />,
      selected: theme === "system",
      onClick: () => setTheme("system"),
    },
  ];

  const IconType = theme === "system" ? "regular" : "solid";

  if (!isClient) return null;
  return (
    <DropdownMenu>
      <ShowTooltip showTooltip={showTooltip}>
        <DropdownMenuTrigger asChild>
          {asChild ? (
            children
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-9 rounded-full relative", className)}
              aria-label="Toggle theme"
            >
              <Sun
                type={IconType}
                className={cn(
                  "size-6 text-yellow-500",
                  "rotate-0 scale-100",
                  "dark:scale-0"
                )}
              />
              <Moon
                type={IconType}
                className={cn(
                  "absolute",
                  "size-6 text-gray-200",
                  "rotate-90 scale-0",
                  "dark:rotate-0 dark:scale-100"
                )}
              />
            </Button>
          )}
        </DropdownMenuTrigger>
      </ShowTooltip>
      <DropdownMenuContent
        align="end"
        side={side}
        sideOffset={sideOffset}
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="font-medium"
      >
        {Options.map((option) => (
          <DropdownMenuItem
            key={option.label}
            disabled={option.selected}
            onClick={option.onClick}
            className={cn(
              "cursor-pointer",
              option.selected && "animate-pulse bg-accent/10"
            )}
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ShowTooltip({
  showTooltip,
  children,
}: {
  showTooltip: boolean;
  children: React.ReactNode;
}) {
  return showTooltip ? (
    <Tooltip content="Theme" variant="borderless" sideOffset={6}>
      {children}
    </Tooltip>
  ) : (
    children
  );
}
