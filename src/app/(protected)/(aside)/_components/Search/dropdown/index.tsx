import type { SearchItem as SearchItemType } from "api";

import { cn } from "@/libraries/utils";
import { Card } from "@/components/ui/card";
import EmptyState from "./EmptyState";
import ItemList from "./ItemList";

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
        "w-full",
        "overflow-hidden"
      )}
    >
      {items.length > 0 ? (
        <ItemList
          query={query}
          items={items}
          onRemoveItem={onRemoveItem}
          onClearAllItems={onClearAllItems}
          onClickItem={onClickItem}
        />
      ) : (
        <EmptyState query={query} />
      )}
    </Card>
  );
}
