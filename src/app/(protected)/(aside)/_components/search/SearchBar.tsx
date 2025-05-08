"use client";

import type { SearchItem as SearchItemType } from "api";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";
import { SearchApi } from "@/services";
import { toast } from "sonner";

import SearchItem from "./SearchItem";
import SearchInput from "./SearchInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XMark } from "@/components/icons";
import { Card } from "@/components/ui/card";
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

export default function SearchBar() {
  const [inputQuery, setInputQuery] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");
  const [items, setItems] = useState<SearchItemType[] | null>(null);
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

  function removeItemHandler(item: SearchItemType) {
    if (!items) return;
    setItems(items.filter((i) => i.id !== item.id));
  }

  function clearAllItemsHandler() {
    setItems([]);
  }

  function handleItemClick(item: SearchItemType) {
    if (item.type === "user") router.push(ROUTE.PROFILE(item.username));
    else if (item.type === "search") router.push(`${ROUTE.SEARCH(item.query)}`);
    else if (item.type === "hashtag") router.push(`${ROUTE.SEARCH(item.tag)}`);

    setIsOpen(false);
  }

  async function searchHandler(query: string) {
    if (!query.trim() || isLoading) return;
    setIsLoading(true);

    const res = await SearchApi.search({ query });
    if (res.success) {
      setItems(res.data ?? []);
      setDisplayQuery(query);
    } else {
      toast.error(res.message || "Failed to perform search");
    }
    setIsLoading(false);
  }

  async function fetchSearchHistory() {
    if (isLoading) return;
    setIsLoading(true);

    const res = await SearchApi.getSearchHistory();
    if (res.success) {
      setItems(res.data ?? []);
      setDisplayQuery("");
    } else {
      toast.error(res.message || "Failed to load search history");
    }
    setIsLoading(false);
  }

  // useEffect(() => {
  //   if (inputQuery) searchHandler(inputQuery);
  //   else if (isOpen) fetchSearchHistory();
  // }, [inputQuery, isOpen, searchHandler, fetchSearchHistory]);

  const showDropdown =
    isOpen && (!isLoading || (isLoading && items && items.length > 0));

  if (pathname === ROUTE.SEARCH()) return null;
  return (
    <div className={cn("w-full mb-6", "relative")} ref={ref}>
      <SearchInput
        id="side-search-input"
        query={inputQuery}
        setQuery={setInputQuery}
        onFocus={() => setIsOpen(true)}
      />
      {isLoading && (
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
      )}

      {showDropdown && (
        <Dropdown
          query={displayQuery}
          items={items}
          isLoading={isLoading}
          inputQuery={inputQuery}
          removeItemHandler={removeItemHandler}
          clearAllItems={clearAllItemsHandler}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
}

type DropdownProps = {
  query: string;
  items: SearchItemType[] | null;
  isLoading: boolean;
  inputQuery: string;
  removeItemHandler: (item: SearchItemType) => void;
  clearAllItems: () => void;
  onItemClick: (item: SearchItemType) => void;
};

function Dropdown({
  query,
  items,
  isLoading,
  inputQuery,
  removeItemHandler,
  clearAllItems,
  onItemClick,
}: DropdownProps) {
  if (!items) return null;
  const renderItemList = (
    title: string,
    showClearButton = false,
    showRemoveButtons = false
  ) => (
    <ScrollArea className="h-[20rem]">
      <div className="py-4">
        <div
          className={cn("flex items-center justify-between", "pl-4 pr-6 mb-4")}
        >
          <span className="text-sm font-semibold">{title}</span>
          {showClearButton && <ClearAllButton onClear={clearAllItems} />}
        </div>
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
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
                    removeItemHandler(item);
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
      </div>
    </ScrollArea>
  );

  const renderEmptyState = () => (
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

  const renderQuerySuggestions = () => (
    <div className="py-2 space-y-2">
      <div
        className={cn(
          "pl-4 pr-5 py-2",
          "cursor-pointer hover:bg-accent/[.05]",
          "transition-colors duration-150 ease-in-out"
        )}
      >
        <div className="text-sm text-muted-foreground">
          Search for {inputQuery}
        </div>
      </div>
      <div
        className={cn(
          "pl-4 pr-5 py-2",
          "cursor-pointer hover:bg-accent/[.05]",
          "transition-colors duration-150 ease-in-out"
        )}
      >
        <div className="text-sm text-muted-foreground">
          Find user @{inputQuery}
        </div>
      </div>
    </div>
  );

  let content;

  if (isLoading && items.length > 0) {
    content = renderItemList(
      query ? "Search Results" : "Recent Searches",
      !query,
      !query
    );
  } else if (inputQuery && !query) {
    content =
      items.length > 0
        ? renderItemList("Recent Searches", true, true)
        : renderQuerySuggestions();
  } else if (query) {
    content =
      items.length > 0
        ? renderItemList("Search Results")
        : renderQuerySuggestions();
  } else {
    content =
      items.length > 0
        ? renderItemList("Recent Searches", true, true)
        : renderEmptyState();
  }

  return (
    <Card
      className={cn(
        "absolute top-full mt-2 z-10",
        "w-full max-h-[20rem]",
        "overflow-hidden"
      )}
    >
      {content}
    </Card>
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
