"use client";

import type { SearchItem as TSearchItem } from "api";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRefreshApi } from "@/components/providers/hooks";
import { SearchApi } from "@/services";
import { toast } from "sonner";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { SearchItem } from "../../../_components";
import { X } from "@/components/icons";
import { SearchCategory } from "@/constants/clientConfig";
import { SearchItemType } from "@/constants/serverConfig";

interface SearchHistoryProps {
  history: TSearchItem[];
  className?: string;
}

export default function SearchHistory({
  history,
  className,
}: Readonly<SearchHistoryProps>) {
  const [items, setItems] = useState<TSearchItem[]>(history);
  const router = useRouter();

  async function handleClick(item: TSearchItem) {
    switch (item.type) {
      case SearchItemType.USER:
        router.push(ROUTE.PROFILE(item.username));
        break;
      case SearchItemType.QUERY:
        router.push(ROUTE.SEARCH(item.id, SearchCategory.TOP));
        break;
      case SearchItemType.HASHTAG:
        router.push(ROUTE.SEARCH(item.id, SearchCategory.HASHTAG));
        break;
      default:
        router.push(ROUTE.SEARCH(item.id, SearchCategory.TOP));
        break;
    }
  }

  const remove = useRefreshApi(SearchApi.removeHistoryItem);
  async function handleRemove(itemId: TSearchItem["id"]) {
    if (!items) return;

    const originalIndex = items.findIndex((item) => item.id === itemId);
    const itemToDelete = items.find((item) => item.id === itemId);
    if (!itemToDelete || originalIndex === -1) return;

    setItems(items.filter((item) => item.id !== itemId));

    const { success, message } = await remove(itemId);
    if (!success) {
      setItems((currentItems) => {
        if (!currentItems) return [itemToDelete];

        const adjustedIndex = Math.min(originalIndex, currentItems.length);
        const newItems = [...currentItems];
        newItems.splice(adjustedIndex, 0, itemToDelete);

        return newItems;
      });

      toast.error(message || "Failed to remove search item");
    }
  }

  const clearItems = useRefreshApi(SearchApi.clearHistory);
  async function handleClear() {
    const previousItems = items;
    setItems([]);

    const { success, message } = await clearItems();
    if (!success) {
      setItems(previousItems);
      toast.error(message || "Failed to clear search history");
    }
  }

  if (items.length === 0) return null;
  return (
    <div className={className}>
      <Header onClear={handleClear} />
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
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
              onClick={(event) => {
                event.stopPropagation();
                handleRemove(item.id);
              }}
            >
              <X className="size-4 fill-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ onClear }: Readonly<{ onClear: () => void }>) {
  return (
    <div className={cn("flex justify-between items-center", "mb-2 px-4")}>
      <h2 className="font-semibold">Recent</h2>
      <button
        type="button"
        onClick={onClear}
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
