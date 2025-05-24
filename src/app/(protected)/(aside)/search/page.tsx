"use client";

import type { SearchResult, SearchItem, ProfileCardInfo } from "api";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { SearchApi, SuggestingApi } from "@/services";
import {
  SEARCH_DEBOUNCE_TIME,
  SEARCH_CATEGORY,
  ROUTE,
} from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { ErrorContent, NavigationBar, type NavItem } from "@/components";
import { PageHeader, SearchInput } from "../_components";
import {
  SearchHistory,
  PopularAccounts,
  SearchResults,
  LoadingIndicator,
} from "./_components";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useDebounceValue(
    initialQuery,
    SEARCH_DEBOUNCE_TIME
  );
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setCategory] = useState<SEARCH_CATEGORY>(
    SEARCH_CATEGORY.TOP
  );

  function isQueryEmpty() {
    return query.trim().length === 0;
  }

  async function search(type: SEARCH_CATEGORY) {
    if (isQueryEmpty()) return;

    setIsSearching(true);
    const res = await SearchApi.detailSearch({ query }, type);
    if (res.success) setResults(res.data ?? null);
    setIsSearching(false);
  }

  useEffect(() => {
    if (!isSearching) {
      const currentPath = ROUTE.SEARCH(
        query,
        isQueryEmpty() ? undefined : activeCategory
      );
      router.replace(currentPath);
      search(activeCategory);
    }
  }, [query, activeCategory]);

  const categories: NavItem[] = [
    {
      id: SEARCH_CATEGORY.TOP,
      label: "Top",
      onSelect: () => setCategory(SEARCH_CATEGORY.TOP),
    },
    {
      id: SEARCH_CATEGORY.LATEST,
      label: "Latest",
      onSelect: () => setCategory(SEARCH_CATEGORY.LATEST),
    },
    {
      id: SEARCH_CATEGORY.PEOPLE,
      label: "People",
      onSelect: () => setCategory(SEARCH_CATEGORY.PEOPLE),
    },
    {
      id: SEARCH_CATEGORY.MEDIA,
      label: "Media",
      onSelect: () => setCategory(SEARCH_CATEGORY.MEDIA),
    },
    {
      id: SEARCH_CATEGORY.HASHTAG,
      label: "Hashtags",
      onSelect: () => setCategory(SEARCH_CATEGORY.HASHTAG),
    },
    {
      id: SEARCH_CATEGORY.POSTS,
      label: "Posts",
      onSelect: () => setCategory(SEARCH_CATEGORY.POSTS),
    },
  ];

  return (
    <div>
      <PageHeader title="Search">
        <div className="px-3 pb-3">
          <SearchInput
            id="side-search-input"
            defaultValue={initialQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
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
              className={cn("absolute top-[8rem] z-10", "bg-background w-full")}
            >
              <NavigationBar items={categories} />
            </div>
            <SearchResults
              results={results}
              type={activeCategory}
              loading={isSearching}
              errorHandler={() => {
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
  const [searchHistory, setSearchHistory] = useState<SearchItem[] | null>(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [popularAccounts, setPopularAccounts] = useState<
    ProfileCardInfo[] | null
  >(null);
  const [isPopularLoaded, setIsPopularLoaded] = useState(false);

  async function fetchSearchHistory() {
    const res = await SearchApi.getSearchHistory();
    if (res.success) setSearchHistory(res.data ?? []);
    setIsHistoryLoaded(true);
  }

  async function fetchPopularAccounts() {
    const res = await SuggestingApi.getPopularAccounts();
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
