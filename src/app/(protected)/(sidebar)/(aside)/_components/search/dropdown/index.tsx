import type { SearchItem } from "../hooks/useSearch";

import { cn } from "@/libraries/utils";
import { Card } from "@/components/ui/card";
import EmptyState from "./EmptyState";
import ItemList from "./ItemList";

type DropdownProps = {
  query: string;
  items: SearchItem[] | null;
  onRemoveItem: (itemId: string) => void;
  onClearAllItems: () => void;
  onClickItem: (item: any) => void;
};

export default function Dropdown({
  query,
  items,
  onRemoveItem,
  onClearAllItems,
  onClickItem,
}: DropdownProps) {
  if (!items) return null;
  const haveItems = items.length > 0;

  return (
    <Card
      className={cn(
        "absolute top-full mt-2 z-10",
        "w-full",
        haveItems && "pt-1",
        "overflow-hidden"
      )}
    >
      {haveItems ? (
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
