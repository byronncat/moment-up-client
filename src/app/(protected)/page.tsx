"use client";

import {
  mockMoments,
  mockFeeds,
  mockFooterLinks,
  mockCurrentUser,
  mockSuggestedUsers,
  mockRecentSearches,
} from "@/__mocks__";

import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { MomentCard } from "@/components/moment";
import {
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  MagnifyingGlass,
  XMark,
  CircleCheck,
} from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HomePage() {
  return (
    <div className={cn("size-full", "pt-5 pb-10")}>
      <div
        className={cn("max-w-[64rem] mx-auto", "flex justify-center", "px-4")}
      >
        <main className="max-w-[37.5rem] w-full">
          <div className="flex flex-col">
            <div className={cn("w-full self-center", "mb-4")}>
              <Feeds />
            </div>
            <Moments />
          </div>
        </main>

        <aside
          className={cn(
            "sticky top-5",
            "h-fit w-[20rem] px-3 ml-auto",
            "space-y-6",
            "hidden lg:block"
          )}
        >
          <SearchBar />
          <SwitchAccount />
          <SuggestedUsers />
          <Footer />
        </aside>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
function Feeds() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const startScrolling = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -1200 : 1200;
      scrollIntervalRef.current = setInterval(() => {
        containerRef.current?.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }, 5);
    }
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <Card
      className={cn("pt-4 pb-2", "relative overflow-hidden", "w-full px-8")}
    >
      <div
        ref={containerRef}
        className={cn(
          "max-w-[32rem] mx-auto",
          "flex gap-4",
          "overflow-x-auto scrollbar-hide",
          "scroll-smooth",
          "snap-x snap-mandatory"
        )}
      >
        <button
          type="button"
          className={cn(
            "relative group",
            "cursor-pointer",
            "snap-start snap-always"
          )}
        >
          <div className={cn("flex items-center justify-center", "size-18")}>
            <div
              className={cn(
                "size-16 rounded-full bg-primary/20",
                "flex items-center justify-center",
                "border-2 border-primary",
                "transition-all duration-200",
                "group-hover:scale-105 group-hover:border-primary/70"
              )}
            >
              <Plus className="size-6 text-card-foreground fill-primary" />
            </div>
          </div>
          <span
            className={cn(
              "text-xs font-semibold",
              "inline-block",
              "max-w-16 truncate text-center",
              "transition-colors group-hover:text-primary"
            )}
          >
            Create
          </span>
        </button>

        {mockFeeds.map((feed) => (
          <div key={feed.id} className="snap-start snap-always">
            <button type="button" className={cn("group", "cursor-pointer")}>
              <div
                className={cn("flex items-center justify-center", "size-18")}
              >
                <div
                  className={cn(
                    "size-16 rounded-full avatar-container",
                    "flex items-center justify-center",
                    "border-2 border-primary",
                    "transition-all duration-200",
                    "group-hover:scale-105 group-hover:border-primary/70"
                  )}
                >
                  <Avatar className="size-14">
                    <AvatarImage
                      src={feed.image}
                      alt={feed.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary">
                      <User className="size-6 fill-card" type="solid" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span
                className={cn(
                  "text-xs font-semibold",
                  "inline-block",
                  "max-w-16 truncate text-center",
                  "transition-colors group-hover:text-primary"
                )}
              >
                {feed.name}
              </span>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll("left")}
        onMouseDown={() => startScrolling("left")}
        onMouseUp={stopScrolling}
        onMouseLeave={stopScrolling}
        className={cn(
          "cursor-pointer",
          "w-8 h-full shrink-0",
          "absolute left-0 top-0",
          "transition-colors duration-200",
          "hover:bg-accent/[.05]",
          "border-r border-border"
        )}
      >
        <ChevronLeft className="size-8 -mt-3" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        onMouseDown={() => startScrolling("right")}
        onMouseUp={stopScrolling}
        onMouseLeave={stopScrolling}
        className={cn(
          "cursor-pointer",
          "w-8 h-full shrink-0",
          "absolute right-0 top-0",
          "transition-colors duration-200",
          "hover:bg-accent/[.05]",
          "border-l border-border"
        )}
      >
        <ChevronRight className="size-8 -mt-3" />
      </button>
    </Card>
  );
}

function Moments() {
  return (
    <div className="flex flex-col gap-4">
      {mockMoments.map((moment) => (
        <MomentCard key={moment.id} data={moment} />
      ))}
    </div>
  );
}

function isUserSearchItem(item: SearchItem): item is UserSearchItem {
  return item.type === "user";
}

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

function SearchBar() {
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
                      <span className="text-sm">Search for "{query}"</span>
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

function SwitchAccount() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-11">
            <AvatarImage
              src={mockCurrentUser.avatar}
              alt="Your profile picture"
              className="object-cover"
            />
            <AvatarFallback className="bg-primary">
              <User className="size-6 fill-card" type="solid" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link
              href="/profile/me"
              className={cn(
                "text-sm font-semibold",
                "hover:opacity-60",
                "transition-opacity duration-150 ease-in-out"
              )}
            >
              {mockCurrentUser.username}
            </Link>
            <span className="text-sm text-muted-foreground">
              {mockCurrentUser.name}
            </span>
          </div>
        </div>
        <button
          className={cn(
            "text-xs font-semibold text-primary",
            "cursor-pointer hover:text-primary/80",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          Switch
        </button>
      </div>
    </div>
  );
}

function SuggestedUsers() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Suggested for you
        </span>
        <button
          className={cn(
            "text-xs font-semibold",
            "cursor-pointer hover:opacity-60",
            "transition-opacity duration-150 ease-in-out"
          )}
        >
          See all
        </button>
      </div>
      <div className="space-y-4">
        {mockSuggestedUsers.map(
          (user: {
            id: number;
            username: string;
            avatar: string;
            followedBy: string;
          }) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.username}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary">
                    <User className="size-4 fill-card" type="solid" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <Link
                    href={`/profile/${user.username}`}
                    className={cn(
                      "text-sm font-semibold",
                      "hover:opacity-60",
                      "transition-opacity duration-150 ease-in-out"
                    )}
                  >
                    {user.username}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    Followed by {user.followedBy}
                  </span>
                </div>
              </div>
              <button
                className={cn(
                  "text-xs font-semibold text-primary",
                  "cursor-pointer hover:text-primary/80",
                  "transition-colors duration-150 ease-in-out"
                )}
              >
                Follow
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="space-y-4 w-full">
      <nav className="flex flex-wrap gap-x-1 gap-y-2">
        {mockFooterLinks.map((link, index) => (
          <span key={link.text} className="flex items-center">
            <Link
              href={link.href}
              className="text-xs text-muted-foreground hover:underline"
            >
              {link.text}
            </Link>
            {index < mockFooterLinks.length - 1 && (
              <span className="text-xs text-muted-foreground mx-1">•</span>
            )}
          </span>
        ))}
      </nav>
      <p className="text-xs text-muted-foreground">© 2025 Byron</p>
    </footer>
  );
}
