"use client";

import { mockRecentSearches } from "@/__mocks__";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { SearchInput, SearchItem } from "@/components";
import { MagnifyingGlass, XMark } from "@/components/icons";

interface UserSearchItem {
  id: number;
  type: "user";
  username: string;
  name: string;
  avatar: string;
  verified: boolean;
}

interface QuerySearchItem {
  id: number;
  type: "search";
  query: string;
}

type SearchItem = UserSearchItem | QuerySearchItem;

function isUserSearchItem(item: SearchItem): item is UserSearchItem {
  return item.type === "user";
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredItems = query
    ? mockRecentSearches.filter(
        (item): item is UserSearchItem =>
          isUserSearchItem(item) &&
          (item.username.toLowerCase().includes(query.toLowerCase()) ||
            item.name.toLowerCase().includes(query.toLowerCase()))
      )
    : mockRecentSearches;

  return (
    <div className={cn("w-full mb-6", "relative")}>
      <SearchInput
        query={query}
        setQuery={setQuery}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />

      {isOpen && (
        <Dropdown
          query={query}
          filteredItems={filteredItems}
          onClose={() => {
            setIsOpen(false);
            setQuery("");
          }}
        />
      )}
    </div>
  );
}

type DropdownProps = Readonly<{
  query: string;
  filteredItems: SearchItem[];
  onClose: () => void;
}>;

function Dropdown({ query, filteredItems, onClose }: DropdownProps) {
  return (
    <div>
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className={cn(
          "absolute top-full mt-2 z-10",
          "w-full",
          "bg-card rounded-xl",
          "border border-border",
          "shadow-lg",
          "max-h-[calc(100vh-12rem)] overflow-y-auto"
        )}
      >
        <div className="py-4">
          {!query ? (
            <>
              <div
                className={cn("flex items-center justify-between", "px-4 mb-4")}
              >
                <span className="text-sm font-semibold">Recent</span>
                <button
                  className={cn(
                    "text-xs font-semibold text-primary",
                    "cursor-pointer hover:text-primary/80",
                    "transition-colors duration-150 ease-in-out"
                  )}
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between",
                      "group",
                      "px-4 py-2",
                      "cursor-pointer hover:bg-accent/[.05]"
                    )}
                  >
                    {isUserSearchItem(item) ? (
                      <SearchItem data={item} variant="user" />
                    ) : (
                      <SearchItem data={item} variant="query" />
                    )}
                    <button
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
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between",
                      "px-4 py-2",
                      "cursor-pointer hover:bg-accent/[.05]"
                    )}
                  >
                    {isUserSearchItem(item) ? (
                      <SearchItem data={item} variant="user" />
                    ) : (
                      <SearchItem data={item} variant="query" />
                    )}
                  </div>
                ))}
              </div>
              <div className={cn(filteredItems.length > 0 && "mt-2")}>
                <div
                  className={cn(
                    "flex items-center gap-2",
                    "cursor-pointer",
                    "px-4"
                  )}
                >
                  <div
                    className={cn(
                      "size-10 mx-1 rounded-full",
                      "flex items-center justify-center"
                    )}
                  >
                    <MagnifyingGlass className="size-4 fill-muted-foreground" />
                  </div>
                  <span className="text-sm">
                    Search for &ldquo;{query}&rdquo;
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
