"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { clsx } from "clsx";

import { Button } from "@/components/ui/button";
import { LaptopMinimal, Moon, Sun } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={clsx("size-9 rounded-full", "duration-200 ease-in-out")}
        >
          {isClient ? (
            <>
              <Sun
                type={theme === "system" ? "regular" : "solid"}
                className={clsx(
                  "size-6 text-yellow-500",
                  "rotate-0 scale-100",
                  "transition-all dark:-rotate-90 dark:scale-0"
                )}
              />
              <Moon
                type={theme === "system" ? "regular" : "solid"}
                className={clsx(
                  "absolute",
                  "size-6 text-gray-200",
                  "rotate-90 scale-0",
                  "transition-all dark:rotate-0 dark:scale-100"
                )}
              />
            </>
          ) : (
            <Sun type="regular" className="size-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="font-medium">
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
