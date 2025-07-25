import type { SearchItem } from "api";

import { cn } from "@/libraries/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "@/components/icons";
import Item from "../SearchItem";
import ClearButton from "./ClearButton";
import { SearchItemType } from "@/constants/serverConfig";

type ItemListProps = {
  query: string;
  items: SearchItem[];
  onRemoveItem: (itemId: SearchItem["id"]) => void;
  onClearAllItems: () => void;
  onClickItem: (item: SearchItem) => void;
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
        className={cn(
          "flex items-center justify-between",
          "pl-4 pr-6 pt-4 pb-2"
        )}
      >
        <span className="text-sm font-semibold">
          {query ? "Search Results" : "Recent Searches"}
        </span>
        {showActionButtons && <ClearButton onClear={onClearAllItems} />}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <ItemButton
            key={item.id}
            item={item}
            onRemoveItem={onRemoveItem}
            onClickItem={onClickItem}
            showActionButtons={showActionButtons}
          />
        ))}
        {query && <QueryButton query={query} onClickItem={onClickItem} />}
      </div>
    </ScrollArea>
  );
}

type ItemButtonProps = Pick<ItemListProps, "onRemoveItem" | "onClickItem"> & {
  item: SearchItem;
  showActionButtons: boolean;
};

function ItemButton({
  item,
  onRemoveItem,
  onClickItem,
  showActionButtons,
}: ItemButtonProps) {
  return (
    <div
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
        aria-label={`Search for ${item.type === SearchItemType.USER ? `@${item.username}` : item.id}`}
      >
        <Item data={item} className="select-none cursor-pointer" />
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
  );
}

function QueryButton({
  query,
  onClickItem,
}: Pick<ItemListProps, "query" | "onClickItem">) {
  return (
    <button
      className={cn(
        "pl-4 pr-5 py-2 w-full",
        "cursor-pointer hover:bg-accent/[.05]",
        "transition-colors duration-150 ease-in-out"
      )}
      onClick={() =>
        onClickItem({
          id: query,
          type: SearchItemType.QUERY,
        })
      }
    >
      <Item
        data={{
          id: `Search for "${query}"`,
          type: SearchItemType.QUERY,
        }}
        className="cursor-pointer"
      />
    </button>
  );
}
