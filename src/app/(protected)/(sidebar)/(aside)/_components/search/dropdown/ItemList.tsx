import type { SearchItem } from "../hooks/useSearch";

import { cn } from "@/libraries/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "@/components/icons";
import Item from "../SearchItem";
import ClearButton from "./ClearButton";
import { SearchItemType } from "@/constants/server";

type ItemListProps = {
  query: string;
  items: SearchItem[];
  onRemoveItem: (itemId: string) => void;
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
    <ScrollArea className="max-h-[320px] flex flex-col">
      <div
        className={cn(
          "flex items-center justify-between",
          "pl-4 pr-4 pt-2 pb-1"
        )}
      >
        <span className="text-sm font-semibold h-6">
          {query ? "Results" : "Recent"}
        </span>
        {showActionButtons ? <ClearButton onClear={onClearAllItems} /> : null}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <ItemButton
            key={item.type === SearchItemType.USER ? item.id : item.query}
            item={item}
            onRemoveItem={onRemoveItem}
            onClickItem={onClickItem}
            showActionButtons={showActionButtons}
          />
        ))}
        {query ? <QueryButton query={query} onClickItem={onClickItem} /> : null}
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
  showActionButtons,
  onRemoveItem,
  onClickItem,
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
      onClick={() => onClickItem(item)}
      aria-label={`Search for ${item.type === SearchItemType.USER ? `@${item.username}` : item.query}`}
    >
      <Item data={item} className="select-none cursor-pointer size-full" />
      {showActionButtons ? (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onRemoveItem(
              item.type === SearchItemType.USER ? item.id : item.query
            );
          }}
          className={cn(
            "p-1.5 rounded-full",
            "hidden group-hover:block",
            "cursor-pointer",
            "hover:bg-accent/[.07]",
            "transition-all duration-150 ease-in-out"
          )}
        >
          <X className="size-4 fill-muted-foreground" />
        </button>
      ) : null}
    </div>
  );
}

function QueryButton({
  query,
  onClickItem,
}: Pick<ItemListProps, "query" | "onClickItem">) {
  return (
    <Item
      data={{
        query: `Search for "${query}"`,
        type: SearchItemType.QUERY,
      }}
      className={cn(
        "pl-4 pr-5 py-2 w-full",
        "cursor-pointer hover:bg-accent/[.05]",
        "transition-colors duration-150 ease-in-out",
        "cursor-pointer"
      )}
      onClick={() =>
        onClickItem({
          query,
          type: SearchItemType.QUERY,
        })
      }
    />
  );
}
