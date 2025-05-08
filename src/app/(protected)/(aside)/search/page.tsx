"use client";

import type { SearchItem as SearchItemType } from "api";
import {
  mockSearches,
  mockFeeds,
  mockSuggestedUsers,
  mockMoments,
} from "@/__mocks__";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { DetailedMoment } from "api";

import { SearchInput, SearchItem } from "../_components";
import NavigationBar, {
  type NavItem,
} from "@/components/HorizontalNavigationBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XMark, CircleCheck, User } from "@/components/icons";
import { MomentCell } from "@/components/moment";

// Define our search item types
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

interface HashtagSearchItem {
  id: number;
  type: "hashtag";
  tag: string;
  postCount: number;
}

type SearchItem = UserSearchItem | QuerySearchItem | HashtagSearchItem;
type SearchCategory = "accounts" | "hashtags" | "posts" | "all";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    accounts: Array<UserSearchItem>;
    hashtags: Array<HashtagSearchItem>;
    posts: Array<DetailedMoment>;
  }>({
    accounts: [],
    hashtags: [],
    posts: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");

  // Filter results based on query
  useEffect(() => {
    if (query.trim().length === 0) {
      setSearchResults({
        accounts: [],
        hashtags: [],
        posts: [],
      });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(() => {
      const filteredAccounts = mockFeeds
        .filter((user) =>
          user.displayName.toLowerCase().includes(query.toLowerCase())
        )
        .map((user, index) => ({
          id: user.id,
          type: "user" as const,
          username: user.displayName.toLowerCase().replace(/\s+/g, ""),
          name: user.displayName,
          avatar: user.avatar,
          verified: index % 3 === 0, // Random verification status for demo
        }));

      const filteredHashtags = mockSearches.filter(
        (tag) =>
          tag.type === "hashtag" &&
          tag.id?.toLowerCase().includes(query.toLowerCase())
      );

      const filteredPosts = mockMoments
        .filter((post) =>
          post.post.text?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6);

      setSearchResults({
        accounts: filteredAccounts as unknown as UserSearchItem[],
        hashtags: filteredHashtags as unknown as HashtagSearchItem[],
        posts: filteredPosts,
      });
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex flex-col h-full">
      <div className={cn("sticky top-0 z-10", "bg-background p-4")}>
        <h1 className="text-xl font-bold mb-3">Search</h1>
        {/* <SearchInput query={query} setQuery={setQuery} /> */}
      </div>

      {/* Search content */}
      <div className="flex-1 overflow-y-auto">
        {query.trim().length === 0 ? (
          <>
            <RecentSearches />
            <PopularAccounts />
          </>
        ) : (
          <>
            <SearchCategories
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              results={searchResults}
            />
            {/* <SearchResults
              results={searchResults}
              isSearching={isSearching}
              query={query}
              activeCategory={activeCategory}
            /> */}
          </>
        )}
      </div>
    </div>
  );
}

function RecentSearches() {
  const Header = () => (
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-semibold">Recent</h2>
      <button className="text-sm text-primary hover:text-primary/80">
        Clear all
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <Header />
      <div className="space-y-1">
        {mockSearches.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between",
              "group",
              "px-4 py-2",
              "cursor-pointer hover:bg-accent/[.05]"
            )}
          >
            <SearchItem data={item} />
            <button className="text-muted-foreground hover:text-foreground">
              <XMark className="size-4 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PopularAccounts() {
  const Header = () => (
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-semibold">Popular Accounts</h2>
      <button className="text-sm text-primary hover:text-primary/80">
        See all
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <Header />
      <div className="grid grid-cols-2 gap-3">
        {mockSuggestedUsers.map((user) => (
          <div
            key={user.id}
            className={cn("p-3", "border border-border", "rounded-lg")}
          >
            <div className={cn("flex flex-col items-center", "text-center")}>
              <Avatar className="size-16 mb-2">
                <AvatarImage
                  src={user.avatar}
                  alt={user.username}
                  className="object-cover object-top"
                />
                <AvatarFallback className="bg-primary">
                  <User className="size-10 fill-card" type="solid" />
                </AvatarFallback>
              </Avatar>
              <div className={cn("flex items-center gap-1", "mb-1")}>
                <p className={cn("font-medium", "truncate max-w-32")}>
                  {user.username}
                </p>
                {user.verified && (
                  <CircleCheck className="size-3.5 fill-primary" />
                )}
              </div>
              <p
                className={cn(
                  "mb-3",
                  "truncate max-w-36",
                  "text-xs text-muted-foreground"
                )}
              >
                Followed by {user.followedBy?.count}
              </p>
              <button
                className={cn(
                  "w-full py-1.5",
                  "text-xs font-semibold text-primary",
                  "border border-primary",
                  "rounded hover:bg-primary/10 transition-colors"
                )}
              >
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchCategories({
  setActiveCategory,
  results,
}: {
  activeCategory: SearchCategory;
  setActiveCategory: (category: SearchCategory) => void;
  results: {
    accounts: Array<UserSearchItem>;
    hashtags: Array<HashtagSearchItem>;
    posts: Array<DetailedMoment>;
  };
}) {
  const categories: NavItem[] = [
    {
      id: "all",
      label: `All (${results.accounts.length + results.hashtags.length + results.posts.length})`,
      onSelect: () => setActiveCategory("all"),
    },
    {
      id: "accounts",
      label: `Accounts (${results.accounts.length})`,
      onSelect: () => setActiveCategory("accounts"),
    },
    {
      id: "hashtags",
      label: `Hashtags (${results.hashtags.length})`,
      onSelect: () => setActiveCategory("hashtags"),
    },
    {
      id: "posts",
      label: `Posts (${results.posts.length})`,
      onSelect: () => setActiveCategory("posts"),
    },
  ];

  return <NavigationBar items={categories} />;
}

function SearchResults({
  results,
  isSearching,
  query,
  activeCategory,
}: {
  results: {
    accounts: Array<UserSearchItem>;
    hashtags: Array<SearchItemType>;
    posts: Array<DetailedMoment>;
  };
  isSearching: boolean;
  query: string;
  activeCategory: SearchCategory;
}) {
  if (isSearching) {
    return (
      <div className="p-4 text-center text-muted-foreground">Searching...</div>
    );
  }

  const totalResults =
    results.accounts.length + results.hashtags.length + results.posts.length;

  if (totalResults === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No results found for &quot;{query}&quot;
      </div>
    );
  }

  const AccountsSection = () => (
    <div className="mb-8">
      <h2 className="font-semibold mb-4">Accounts</h2>
      <div className="space-y-3">
        {results.accounts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between",
              "group",
              "px-4 py-2",
              "cursor-pointer hover:bg-accent/[.05]"
            )}
          >
            {/* <SearchItem data={item} variant="user" /> */}
            <button className="text-sm text-primary font-semibold hover:text-primary/80">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const HashtagsSection = () => (
    <div className="mb-8">
      <h2 className="font-semibold mb-4">Hashtags</h2>
      <div className="space-y-3">
        {results.hashtags.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between",
              "group",
              "px-4 py-2",
              "cursor-pointer hover:bg-accent/[.05]"
            )}
          >
            <SearchItem data={item} />
          </div>
        ))}
      </div>
    </div>
  );

  const PostsSection = () => (
    <div>
      {activeCategory === "all" && (
        <h2 className="font-semibold mb-4">Posts</h2>
      )}
      <div className="grid grid-cols-3 gap-1">
        {results.posts
          .slice(0, activeCategory === "all" ? 6 : undefined)
          .map((post) => (
            // <MomentCell key={post.id} data={post} />
            <div key={post.id}>{post.id}</div>
          ))}
      </div>

      {activeCategory === "all" && results.posts.length > 6 && (
        <button
          className="w-full text-sm text-primary hover:text-primary/80 py-4 mt-2"
          // onClick={() => setActiveCategory("posts")}
        >
          See all posts
        </button>
      )}
    </div>
  );

  return (
    <div className="p-4">
      {(activeCategory === "all" || activeCategory === "accounts") &&
        results.accounts.length > 0 && <AccountsSection />}
      {(activeCategory === "all" || activeCategory === "hashtags") &&
        results.hashtags.length > 0 && <HashtagsSection />}
      {(activeCategory === "all" || activeCategory === "posts") &&
        results.posts.length > 0 && <PostsSection />}
    </div>
  );
}
