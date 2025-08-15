"use client";

import type { SearchItem as SearchItemType } from "api";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { SearchItem } from "../../_components";
import { X } from "@/components/icons";

interface SearchHistoryProps {
  history: SearchItemType[];
}

export default function SearchHistory({
  history,
}: Readonly<SearchHistoryProps>) {
  if (history.length > 0)
    return (
      <div>
        <Header />
        <div className="space-y-1">
          {history.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between",
                "group",
                "px-4 py-2",
                "cursor-pointer hover:bg-accent/[.05]"
              )}
            >
              <SearchItem data={item} />
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-full"
              >
                <X className="size-4 fill-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
}

function Header() {
  return (
    <div className={cn("flex justify-between items-center", "mb-2 px-4")}>
      <h2 className="font-semibold">Recent</h2>
      <button
        className={cn(
          "text-primary hover:text-primary/80",
          "text-sm cursor-pointer"
        )}
      >
        Clear all
      </button>
    </div>
  );
}
