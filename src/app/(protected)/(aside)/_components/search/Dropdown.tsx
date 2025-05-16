import type { SearchItem as SearchItemType } from "api";

import { cn } from "@/libraries/utils";
import SearchItem from "./SearchItem";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XMark, MagnifyingGlass, User } from "@/components/icons";

type DropdownProps = {
  query: string;
  items: SearchItemType[] | null;
  onRemoveItem: (itemId: SearchItemType["id"]) => void;
  onClearAllItems: () => void;
  onClickItem: (item: SearchItemType) => void;
};

export default function Dropdown({
  query,
  items,
  onRemoveItem,
  onClearAllItems,
  onClickItem,
}: DropdownProps) {
  if (!items) return null;

  return (
    <Card
      className={cn(
        "absolute top-full mt-2 z-10",
        "w-full pt-3 pb-4",
        "overflow-hidden"
      )}
    >
      {items.length > 0 ? (
        <ItemList
          title={query ? "Search Results" : "Recent Searches"}
          items={items}
          showClearButton={!query}
          showRemoveButtons={!query}
          onClearAllItems={onClearAllItems}
          onClickItem={onClickItem}
          onRemoveItem={onRemoveItem}
        />
      ) : (
        <EmptyState query={query} />
      )}
    </Card>
  );
}

type ItemListProps = {
  title: string;
  showClearButton?: boolean;
  showRemoveButtons?: boolean;
  onClearAllItems: () => void;
  onClickItem: (item: SearchItemType) => void;
  items: SearchItemType[];
  onRemoveItem: (itemId: SearchItemType["id"]) => void;
};

function ItemList({
  title,
  items,
  showClearButton = false,
  showRemoveButtons = false,
  onClearAllItems,
  onClickItem,
  onRemoveItem,
}: ItemListProps) {
  return (
    <ScrollArea className="h-[20rem]">
      <div
        className={cn("flex items-center justify-between", "pl-4 pr-6 mb-4")}
      >
        <span className="text-sm font-semibold">{title}</span>
        {showClearButton && <ClearAllButton onClear={onClearAllItems} />}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onClickItem(item)}
            className={cn(
              "flex items-center justify-between",
              "group",
              "pl-4 pr-5 py-2",
              "cursor-pointer hover:bg-accent/[.05]",
              "transition-colors duration-150 ease-in-out"
            )}
          >
            <SearchItem data={item} />
            {showRemoveButtons && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
                <XMark className="size-4 fill-muted-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function EmptyState({ query }: Readonly<{ query: string }>) {
  if (!query)
    return (
      <div>
        <div
          className={cn(
            "text-sm text-muted-foreground",
            "text-center flex flex-col items-center",
            "px-4 pt-3 pb-6"
          )}
        >
          <span>Try searching for people, places,</span>
          <span>things, or hashtags</span>
        </div>
      </div>
    );

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "pl-5 py-2",
          "cursor-pointer hover:bg-accent/[.05]",
          "transition-colors duration-150 ease-in-out"
        )}
      >
        <div
          className={cn(
            "text-sm text-muted-foreground fill-muted-foreground",
            "flex items-center gap-3"
          )}
        >
          <MagnifyingGlass className="size-4" />
          Search for {query}
        </div>
      </div>
      <div
        className={cn(
          "pl-5 py-2",
          "cursor-pointer hover:bg-accent/[.05]",
          "transition-colors duration-150 ease-in-out"
        )}
      >
        <div
          className={cn(
            "text-sm text-muted-foreground fill-muted-foreground",
            "flex items-center gap-3"
          )}
        >
          <User className="size-4" type="solid" /> Find user @{query}
        </div>
      </div>
    </div>
  );
}

type ClearAllButtonProps = {
  onClear: () => void;
};

function ClearAllButton({ onClear }: ClearAllButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={cn(
            "text-xs font-semibold text-primary",
            "cursor-pointer hover:text-primary/80",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          Clear all
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear search history</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to clear all your recent searches? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClear}>Clear</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
