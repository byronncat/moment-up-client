"use client";

import type { UserSearchItem, QuerySearchItem } from "api";

import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useSearch } from "./hooks/useSearch";
import { ROUTE } from "@/constants/route";
import { SearchCategory } from "@/constants/client";
import { SearchItemType } from "@/constants/server";

import { cn } from "@/libraries/utils";
import SearchInput from "./SearchInput";
import Dropdown from "./dropdown";

export default function SearchBar({
  className,
}: Readonly<{ className?: string }>) {
  const {
    items,
    query,
    isLoading,
    isSearching,
    setQuery,
    setSearching,
    addHistory,
    removeHistory,
    clearHistory,
    reset,
  } = useSearch();

  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as React.RefObject<HTMLElement>, (event) => {
    if ((event.target as HTMLElement).closest('[role="alertdialog"]')) return;
    reset();
  });

  function handleClickItem(item: UserSearchItem | QuerySearchItem) {
    reset();
    switch (item.type) {
      case SearchItemType.USER:
        router.push(ROUTE.PROFILE(item.username));
        addHistory(item, SearchItemType.USER);
        break;
      case SearchItemType.QUERY:
        router.push(ROUTE.SEARCH(item.query, SearchCategory.PEOPLE));
        addHistory(item, SearchItemType.QUERY);
        break;
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleInputFocus() {
    setSearching(true);
  }

  if (pathname === ROUTE.SEARCH()) return null;
  const showDropdown = isSearching && !isLoading;
  return (
    <div className={cn("relative", className)} ref={ref}>
      <SearchInput
        id="side-search-input"
        loading={isLoading}
        onFocus={handleInputFocus}
        onChange={handleInputChange}
      />
      {showDropdown && (
        <Dropdown
          query={query}
          items={items}
          onRemoveItem={removeHistory}
          onClearAllItems={clearHistory}
          onClickItem={handleClickItem}
        />
      )}
    </div>
  );
}
