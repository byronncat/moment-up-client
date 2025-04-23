"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import Tooltip from "./Tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LaptopMinimal, Moon, Sun } from "@/components/icons";

export default function ModeSelection({ className }: ComponentProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <Tooltip content="Theme" variant="borderless" sideOffset={6}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-9 rounded-full",
              "duration-200 ease-in-out",
              className
            )}
          >
            <Sun
              type={theme === "system" ? "regular" : "solid"}
              className={cn(
                "size-6 text-yellow-500",
                "rotate-0 scale-100",
                "transition-all dark:-rotate-90 dark:scale-0"
              )}
            />
            <Moon
              type={theme === "system" ? "regular" : "solid"}
              className={cn(
                "absolute",
                "size-6 text-gray-200",
                "rotate-90 scale-0",
                "transition-all dark:rotate-0 dark:scale-100"
              )}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent
        align="end"
        className="font-medium"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          disabled={theme === "light"}
          className="cursor-pointer hover:animate-pulse"
        >
          <Sun type="regular" className="size-5" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          disabled={theme === "dark"}
          className="cursor-pointer hover:animate-pulse"
        >
          <Moon type="regular" className="size-5" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          disabled={theme === "system"}
          className="cursor-pointer hover:animate-pulse"
        >
          <LaptopMinimal className="size-5" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
