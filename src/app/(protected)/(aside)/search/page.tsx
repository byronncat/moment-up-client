"use client";

import { useEffect, useState } from "react";
import {
  mockRecentSearches,
  mockFeeds,
  mockSuggestedUsers,
  mockMoments,
} from "@/__mocks__";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  MagnifyingGlass,
  XMark,
  CircleCheck,
  Bookmark,
  Comment,
  Heart,
  Share,
} from "@/components/icons";

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

function isUserSearchItem(item: SearchItem): item is UserSearchItem {
  return item.type === "user";
}

function isHashtagSearchItem(item: any): item is HashtagSearchItem {
  return item.type === "hashtag";
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    accounts: Array<UserSearchItem>;
    hashtags: Array<HashtagSearchItem>;
    posts: Array<any>;
  }>({
    accounts: [],
    hashtags: [],
    posts: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");

  // Generate some mock hashtags
  const mockHashtags = [
    { id: 1, type: "hashtag" as const, tag: "travel", postCount: 1223 },
    { id: 2, type: "hashtag" as const, tag: "photography", postCount: 945 },
    { id: 3, type: "hashtag" as const, tag: "nature", postCount: 876 },
    { id: 4, type: "hashtag" as const, tag: "food", postCount: 732 },
    { id: 5, type: "hashtag" as const, tag: "art", postCount: 625 },
    { id: 6, type: "hashtag" as const, tag: "fashion", postCount: 589 },
    { id: 7, type: "hashtag" as const, tag: "fitness", postCount: 478 },
    { id: 8, type: "hashtag" as const, tag: "music", postCount: 412 },
  ];

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

    // Simulate search delay
    const timer = setTimeout(() => {
      // Filter accounts
      const filteredAccounts = mockFeeds
        .filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))
        .map((user, index) => ({
          id: user.id,
          type: "user" as const,
          username: user.name.toLowerCase().replace(/\s+/g, ""),
          name: user.name,
          avatar: user.image,
          verified: index % 3 === 0, // Random verification status for demo
        }));

      // Filter hashtags
      const filteredHashtags = mockHashtags.filter((tag) =>
        tag.tag.toLowerCase().includes(query.toLowerCase())
      );

      // Filter posts
      const filteredPosts = mockMoments
        .filter((post) =>
          post.text?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6);

      setSearchResults({
        accounts: filteredAccounts,
        hashtags: filteredHashtags,
        posts: filteredPosts,
      });
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex flex-col h-full">
      {/* Search header */}
      <div className="sticky top-0 z-10 bg-background p-4 border-b border-border">
        <h1 className="text-xl font-bold mb-3">Search</h1>
        <SearchInput query={query} setQuery={setQuery} />
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
            <SearchResults
              results={searchResults}
              isSearching={isSearching}
              query={query}
              activeCategory={activeCategory}
            />
          </>
        )}
      </div>
    </div>
  );
}

function SearchInput({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (value: string) => void;
}) {
  return (
    <div className="relative">
      <MagnifyingGlass
        className={cn(
          "size-4",
          "absolute left-3 top-1/2 -translate-y-1/2 z-10",
          "fill-muted-foreground"
        )}
      />
      <Input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn("h-10 bg-card pl-9", query && "pr-9")}
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 z-10",
            "p-1 rounded-full",
            "cursor-pointer",
            "hover:bg-accent"
          )}
        >
          <XMark className="size-4 fill-muted-foreground" />
        </button>
      )}
    </div>
  );
}

function SearchCategories({
  activeCategory,
  setActiveCategory,
  results,
}: {
  activeCategory: SearchCategory;
  setActiveCategory: (category: SearchCategory) => void;
  results: {
    accounts: Array<UserSearchItem>;
    hashtags: Array<HashtagSearchItem>;
    posts: Array<any>;
  };
}) {
  const categories: Array<{
    id: SearchCategory;
    name: string;
    count: number;
  }> = [
    {
      id: "all",
      name: "All",
      count:
        results.accounts.length +
        results.hashtags.length +
        results.posts.length,
    },
    { id: "accounts", name: "Accounts", count: results.accounts.length },
    { id: "hashtags", name: "Hashtags", count: results.hashtags.length },
    { id: "posts", name: "Posts", count: results.posts.length },
  ];

  return (
    <div className="flex border-b border-border">
      {categories.map((category) => (
        <button
          key={category.id}
          className={cn(
            "flex-1 py-3 text-sm font-medium",
            "border-b-2 transition-colors",
            activeCategory === category.id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveCategory(category.id)}
        >
          {category.name} {category.count > 0 && `(${category.count})`}
        </button>
      ))}
    </div>
  );
}

function RecentSearches() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Recent</h2>
        <button className="text-sm text-primary hover:text-primary/80">
          Clear all
        </button>
      </div>
      <div className="space-y-3">
        {mockRecentSearches.slice(0, 8).map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            {isUserSearchItem(item) ? (
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage
                    src={item.avatar}
                    alt={item.username}
                    className="object-cover object-top"
                  />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{item.username}</p>
                    {item.verified && (
                      <CircleCheck className="size-3.5 fill-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-accent flex items-center justify-center">
                  <MagnifyingGlass className="size-5 fill-foreground" />
                </div>
                <p>{item.query}</p>
              </div>
            )}
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
  return (
    <div className="p-4 border-t border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Popular Accounts</h2>
        <button className="text-sm text-primary hover:text-primary/80">
          See all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {mockSuggestedUsers.map((user) => (
          <div key={user.id} className="p-3 border border-border rounded-lg">
            <div className="flex flex-col items-center text-center">
              <Avatar className="size-16 mb-2">
                <AvatarImage
                  src={user.avatar}
                  alt={user.username}
                  className="object-cover object-top"
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 mb-1">
                <p className="font-medium truncate max-w-32">{user.username}</p>
                {user.id % 3 === 0 && (
                  <CircleCheck className="size-3.5 fill-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3 truncate max-w-36">
                Followed by {user.followedBy}
              </p>
              <button className="w-full py-1.5 text-xs font-semibold text-primary border border-primary rounded hover:bg-primary/10 transition-colors">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchResults({
  results,
  isSearching,
  query,
  activeCategory,
}: {
  results: {
    accounts: Array<UserSearchItem>;
    hashtags: Array<HashtagSearchItem>;
    posts: Array<any>;
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
        No results found for "{query}"
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Accounts section */}
      {(activeCategory === "all" || activeCategory === "accounts") &&
        results.accounts.length > 0 && (
          <div className="mb-8">
            {activeCategory === "all" && (
              <h2 className="font-semibold mb-4">Accounts</h2>
            )}
            <div className="space-y-3">
              {results.accounts
                .slice(0, activeCategory === "all" ? 3 : undefined)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <Link
                      href={`/profile/${item.username}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="size-12">
                        <AvatarImage
                          src={item.avatar}
                          alt={item.username}
                          className="object-cover object-top"
                        />
                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium">{item.username}</p>
                          {item.verified && (
                            <CircleCheck className="size-3.5 fill-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.name}
                        </p>
                      </div>
                    </Link>
                    <button className="text-sm text-primary font-semibold hover:text-primary/80">
                      Follow
                    </button>
                  </div>
                ))}

              {activeCategory === "all" && results.accounts.length > 3 && (
                <button
                  className="w-full text-sm text-primary hover:text-primary/80 py-2"
                  // onClick={() => setActiveCategory("accounts")}
                >
                  See all accounts
                </button>
              )}
            </div>
          </div>
        )}

      {/* Hashtags section */}
      {(activeCategory === "all" || activeCategory === "hashtags") &&
        results.hashtags.length > 0 && (
          <div className="mb-8">
            {activeCategory === "all" && (
              <h2 className="font-semibold mb-4">Hashtags</h2>
            )}
            <div className="space-y-3">
              {results.hashtags
                .slice(0, activeCategory === "all" ? 3 : undefined)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-lg font-medium">#</span>
                      </div>
                      <div>
                        <p className="font-medium">#{item.tag}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.postCount.toLocaleString()} posts
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-primary font-semibold hover:text-primary/80">
                      Follow
                    </button>
                  </div>
                ))}

              {activeCategory === "all" && results.hashtags.length > 3 && (
                <button
                  className="w-full text-sm text-primary hover:text-primary/80 py-2"
                  // onClick={() => setActiveCategory("hashtags")}
                >
                  See all hashtags
                </button>
              )}
            </div>
          </div>
        )}

      {/* Posts section */}
      {(activeCategory === "all" || activeCategory === "posts") &&
        results.posts.length > 0 && (
          <div>
            {activeCategory === "all" && (
              <h2 className="font-semibold mb-4">Posts</h2>
            )}
            <div className="grid grid-cols-3 gap-1">
              {results.posts
                .slice(0, activeCategory === "all" ? 6 : undefined)
                .map((post) => (
                  <div
                    key={post.id}
                    className="relative aspect-square overflow-hidden group"
                  >
                    <img
                      src={post.files[0].url}
                      alt={post.text}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-3 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="size-4 fill-white" />
                          <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Comment className="size-4 fill-white" />
                          <span className="text-sm">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
        )}
    </div>
  );
}
