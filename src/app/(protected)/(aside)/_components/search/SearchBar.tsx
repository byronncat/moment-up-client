"use client";

import type { SearchItem } from "api";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { useOnClickOutside, useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { SearchApi } from "@/services";
import { ROUTE, SEARCH_DEBOUNCE_TIME } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import SearchInput from "./SearchInput";
import Dropdown from "./Dropdown";

export default function SearchBar() {
  const [query, setQuery] = useDebounceValue("", SEARCH_DEBOUNCE_TIME);
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as React.RefObject<HTMLElement>, (event) => {
    if ((event.target as HTMLElement).closest('[role="alertdialog"]')) return;
    setItems([]);
    setIsOpen(false);
  });

  function removeItem(itemId: SearchItem["id"]) {
    if (!items) return;
    setItems(items.filter((i) => i.id !== itemId));
  }

  function clearAllItems() {
    setItems([]);
  }

  function clickItem(item: SearchItem) {
    if (item.type === "user") router.push(ROUTE.PROFILE(item.username));
    else if (item.type === "search") router.push(ROUTE.SEARCH(item.query));
    else if (item.type === "hashtag") router.push(ROUTE.SEARCH(item.id));
    setIsOpen(false);
  }

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);

    const res = await SearchApi.search({ query });
    if (res.success) setItems(res.data ?? []);
    else toast.error(res.message || "Failed to perform search");

    setIsLoading(false);
  }, []);

  const fetchSearchHistory = useCallback(async () => {
    setIsLoading(true);

    const res = await SearchApi.getSearchHistory();
    if (res.success) setItems(res.data ?? []);
    else toast.error(res.message || "Failed to load search history");

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (query) search(query);
    else if (isOpen) fetchSearchHistory();
  }, [query, isOpen, fetchSearchHistory, search]);

  const showDropdown = isOpen && !isLoading;
  if (pathname === ROUTE.SEARCH()) return null;
  return (
    <div className={cn("w-full mb-6", "relative")} ref={ref}>
      <SearchInput
        id="side-search-input"
        onFocus={() => setIsOpen(true)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
      />
      {isLoading && <LoadingIndicator />}

      {showDropdown && (
        <Dropdown
          query={query}
          items={items}
          onRemoveItem={removeItem}
          onClearAllItems={clearAllItems}
          onClickItem={clickItem}
        />
      )}
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div
      className={cn(
        "w-full h-0.25",
        "absolute left-0 bottom-0",
        "flex items-center justify-center"
      )}
    >
      <div
        className={cn(
          "w-[96%] h-full",
          "rounded-full overflow-hidden",
          "flex items-center justify-center"
        )}
      >
        <div
          className={cn(
            "inline-block size-full",
            "bg-primary animate-search-loading"
          )}
        />
      </div>
    </div>
  );
}
