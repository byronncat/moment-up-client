"use client";

import type { SearchResult, SearchItem, ProfileSearchItem } from "api";

import {
  // useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { SuggestApi } from "@/services";
import {
  SEARCH_DEBOUNCE_TIME,
  SearchCategory,
  // ROUTE,
} from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { ErrorContent, NavigationBar, type NavItem } from "@/components/common";
import { PageHeader, SearchInput } from "../_components";
import {
  SearchHistory,
  PopularAccounts,
  SearchResults,
  LoadingIndicator,
} from "./_components";

export default function SearchPage() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useDebounceValue(
    initialQuery,
    SEARCH_DEBOUNCE_TIME
  );
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setCategory] = useState<SearchCategory>(
    SearchCategory.TOP
  );

  function isQueryEmpty() {
    return query.trim().length === 0;
  }

  // async function search(type: SEARCH_CATEGORY) {
  //   if (isQueryEmpty()) return;

  //   setIsSearching(true);
  //   const res = await SearchApi.detailSearch({ query }, type);
  //   if (res.success) setResults(res.data ?? null);
  //   setIsSearching(false);
  // }

  // useEffect(() => {
  //   if (!isSearching) {
  //     const currentPath = ROUTE.SEARCH(
  //       query,
  //       isQueryEmpty() ? undefined : activeCategory
  //     );
  //     router.replace(currentPath);
  //     search(activeCategory);
  //   }
  // }, [query, activeCategory,]);

  const categories: NavItem[] = [
    {
      id: SearchCategory.TOP,
      label: "Top",
      onSelect: () => setCategory(SearchCategory.TOP),
    },
    {
      id: SearchCategory.LATEST,
      label: "Latest",
      onSelect: () => setCategory(SearchCategory.LATEST),
    },
    {
      id: SearchCategory.PEOPLE,
      label: "People",
      onSelect: () => setCategory(SearchCategory.PEOPLE),
    },
    {
      id: SearchCategory.MEDIA,
      label: "Media",
      onSelect: () => setCategory(SearchCategory.MEDIA),
    },
    {
      id: SearchCategory.HASHTAG,
      label: "Hashtags",
      onSelect: () => setCategory(SearchCategory.HASHTAG),
    },
    {
      id: SearchCategory.POSTS,
      label: "Posts",
      onSelect: () => setCategory(SearchCategory.POSTS),
    },
  ];

  return (
    <div>
      <PageHeader title="Search">
        <div className="px-3 pb-3">
          <SearchInput
            id="side-search-input"
            defaultValue={initialQuery}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(event.target.value)
            }
          />
        </div>
      </PageHeader>

      <div className="size-full">
        {isQueryEmpty() ? (
          <NoSearchState />
        ) : (
          <>
            <div
              className={cn(
                "absolute top-[128px] z-10",
                "bg-background w-full"
              )}
            >
              <NavigationBar items={categories} />
            </div>
            <SearchResults
              results={results}
              type={activeCategory}
              loading={isSearching}
              onError={() => {
                setResults(null);
                setIsSearching(false);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function NoSearchState() {
  const [searchHistory] = useState<SearchItem[] | null>(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [popularAccounts, setPopularAccounts] = useState<
    ProfileSearchItem[] | null
  >(null);
  const [isPopularLoaded, setIsPopularLoaded] = useState(false);

  async function fetchSearchHistory() {
    // const res = await SearchApi.getSearchHistory();
    // if (res.success) setSearchHistory(res.data ?? []);
    setIsHistoryLoaded(true);
  }

  async function fetchPopularAccounts() {
    const res = await SuggestApi.getPopularAccounts();
    if (res.success) setPopularAccounts(res.data ?? []);
    setIsPopularLoaded(true);
  }

  function handleRefresh() {
    setIsHistoryLoaded(false);
    setIsPopularLoaded(false);
    fetchSearchHistory();
    fetchPopularAccounts();
  }

  useEffect(() => {
    fetchSearchHistory();
    fetchPopularAccounts();
  }, []);

  if (!isHistoryLoaded || !isPopularLoaded) return <LoadingIndicator />;
  if (!searchHistory && !popularAccounts)
    return (
      <div className="h-full pb-10">
        <ErrorContent onRefresh={handleRefresh} />
      </div>
    );

  return (
    <div className="pb-10">
      {searchHistory && <SearchHistory history={searchHistory} />}
      {popularAccounts && (
        <PopularAccounts
          users={popularAccounts}
          className={cn(searchHistory && "mt-6")}
        />
      )}
    </div>
  );
}
