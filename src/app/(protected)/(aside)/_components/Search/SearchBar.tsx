"use client";

import type { SearchItem } from "api";

import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useSearch } from "./hooks/useSearch";
import { ROUTE } from "@/constants/route";
import { SearchItemType } from "@/constants/serverConfig";

import { cn } from "@/libraries/utils";
import SearchInput from "./SearchInput";
import Dropdown from "./dropdown";

export default function SearchBar() {
  const {
    isLoading,
    isSearching,
    setIsSearching,
    query,
    setQuery,
    items,
    removeItem,
    clearAllItems,
    reset,
  } = useSearch();

  const pathname = usePathname();
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as React.RefObject<HTMLElement>, (event) => {
    if ((event.target as HTMLElement).closest('[role="alertdialog"]')) return;
    reset();
  });

  function handleClickItem(item: SearchItem) {
    reset();
    if (item.type === SearchItemType.USER)
      router.push(ROUTE.PROFILE(item.username));
    else if (item.type === SearchItemType.HASHTAG)
      router.push(ROUTE.SEARCH(`#${item.id}`));
    else router.push(ROUTE.SEARCH(item.id));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleInputFocus() {
    setIsSearching(true);
  }

  if (pathname === ROUTE.SEARCH()) return null;
  const showDropdown = isSearching && !isLoading;
  return (
    <div className={cn("w-full mb-6", "relative")} ref={ref}>
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
          onRemoveItem={removeItem}
          onClearAllItems={clearAllItems}
          onClickItem={handleClickItem}
        />
      )}
    </div>
  );
}
