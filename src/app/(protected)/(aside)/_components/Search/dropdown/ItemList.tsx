import type { SearchItem as SearchItemType } from "api";

import { cn } from "@/libraries/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "@/components/icons";
import SearchItem from "../SearchItem";
import ClearButton from "./ClearButton";

type ItemListProps = {
  query: string;
  items: SearchItemType[];
  onRemoveItem: (itemId: SearchItemType["id"]) => void;
  onClearAllItems: () => void;
  onClickItem: (item: SearchItemType) => void;
};

export default function ItemList({
  query,
  items,
  onRemoveItem,
  onClearAllItems,
  onClickItem,
}: ItemListProps) {
  const showActionButtons = !query;

  return (
    <ScrollArea className="h-[320px]">
      <div
        className={cn("flex items-center justify-between", "pl-4 pr-6 mb-4")}
      >
        <span className="text-sm font-semibold">
          {query ? "Search Results" : "Recent Searches"}
        </span>
        {showActionButtons && <ClearButton onClear={onClearAllItems} />}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between",
              "group",
              "pl-4 pr-5 py-2",
              "cursor-pointer hover:bg-accent/[.05]",
              "transition-colors duration-150 ease-in-out"
            )}
          >
            <button
              onClick={() => onClickItem(item)}
              type="button"
              aria-label={`Search for ${item.type === "user" ? `@${item.username}` : item.id}`}
            >
              <SearchItem data={item} />
            </button>
            {showActionButtons && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveItem(item.id);
                }}
                className={cn(
                  "p-1.5 rounded-full",
                  "opacity-0 group-hover:opacity-100",
                  "cursor-pointer",
                  "hover:bg-accent/[.07]",
                  "transition-all duration-150 ease-in-out"
                )}
              >
                <X className="size-4 fill-muted-foreground" />
              </button>
            )}
          </div>
        ))}
        {query && (
          <button
            className={cn(
              "pl-4 pr-5 py-2 w-full",
              "cursor-pointer hover:bg-accent/[.05]",
              "transition-colors duration-150 ease-in-out"
            )}
            onClick={() =>
              onClickItem({
                id: query,
                type: "search",
                query: query,
              })
            }
          >
            <SearchItem
              data={{
                id: query,
                type: "search",
                query: `Search for "${query}"`,
              }}
            />
          </button>
        )}
      </div>
    </ScrollArea>
  );
}
