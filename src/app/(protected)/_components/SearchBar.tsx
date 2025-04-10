"use client";

import { mockRecentSearches } from "@/__mocks__";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MagnifyingGlass, User, XMark, CircleCheck } from "@/components/icons";

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
      <div
        className={cn(
          "relative",
          "flex items-center",
          "bg-card",
          "rounded-full",
          "border border-border",
          "transition-all duration-200",
          "focus-within:border-primary/70 focus-within:ring-1 focus-within:ring-primary/20"
        )}
      >
        <MagnifyingGlass
          className={cn("size-4", "absolute left-4", "fill-muted-foreground")}
        />
        <input
          type="text"
          id="search-input"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={cn(
            "w-full",
            "py-2 pl-10 pr-4",
            "bg-transparent",
            "text-sm",
            "outline-none",
            "placeholder:text-muted-foreground"
          )}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className={cn(
              "absolute right-4",
              "p-1.5 rounded-full",
              "cursor-pointer",
              "hover:bg-accent/[.07]",
              "transition-colors duration-150 ease-in-out"
            )}
          >
            <XMark className="size-3 fill-muted-foreground" />
          </button>
        )}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
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
                    className={cn(
                      "flex items-center justify-between",
                      "px-4 mb-4"
                    )}
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
                          <div className="flex items-center gap-3">
                            <Avatar className="size-12">
                              <AvatarImage
                                src={item.avatar}
                                alt={item.username}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-primary">
                                <User
                                  className="size-6 fill-card"
                                  type="solid"
                                />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold">
                                  {item.username}
                                </span>
                                {item.verified && (
                                  <CircleCheck className="size-3.5 fill-primary" />
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {item.name}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "size-12 rounded-full",
                                "flex items-center justify-center",
                                "bg-accent/[.07]"
                              )}
                            >
                              <MagnifyingGlass className="size-5 fill-muted-foreground" />
                            </div>
                            <span className="text-sm">{item.query}</span>
                          </div>
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
                        <div className="flex items-center gap-3">
                          <Avatar className="size-12">
                            <AvatarImage
                              src={item.avatar}
                              alt={item.username}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-primary">
                              <User className="size-6 fill-card" type="solid" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold">
                                {item.username}
                              </span>
                              {item.verified && (
                                <div>
                                  <CircleCheck className="size-3.5 fill-primary" />
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {item.name}
                            </span>
                          </div>
                        </div>
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
        </>
      )}
    </div>
  );
}
