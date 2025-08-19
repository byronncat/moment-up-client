"use client";

import type { SearchItem } from "api";

import { useSearchParams } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useRefreshApi } from "@/components/providers";
import { SearchApi, SearchSortParams, SearchTypeParams } from "@/services";
import { SEARCH_DEBOUNCE_TIME, SearchCategory } from "@/constants/clientConfig";
import { ROUTE, SearchParamName } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { NavigationBar, type NavItem } from "@/components/common";
import { PageHeader, SearchInput } from "../_components";
import { EmptySearchView, SearchResults } from "./_components";

type MapType = {
  [key in SearchCategory]: {
    type: SearchTypeParams;
    order: SearchSortParams;
  };
};

const TypeMap: MapType = {
  [SearchCategory.TOP]: {
    type: "user&hashtag&post",
    order: "most_popular",
  },
  [SearchCategory.LATEST]: {
    type: "user&hashtag&post",
    order: "newest",
  },
  [SearchCategory.PEOPLE]: {
    type: "user",
    order: "most_popular",
  },
  [SearchCategory.HASHTAG]: {
    type: "hashtag",
    order: "most_popular",
  },
  [SearchCategory.POSTS]: {
    type: "post",
    order: "most_popular",
  },
  [SearchCategory.MEDIA]: {
    type: "media",
    order: "most_popular",
  },
};

function getInitialCategory(param: string): SearchCategory {
  const validCategories = Object.values(SearchCategory) as string[];
  return param && validCategories.includes(param)
    ? (param as SearchCategory)
    : SearchCategory.TOP;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get(SearchParamName.QUERY) || "";
  const initialCategory = getInitialCategory(
    searchParams.get(SearchParamName.CATEGORY) || ""
  );

  const [query, setQuery] = useDebounceValue(
    initialQuery,
    SEARCH_DEBOUNCE_TIME
  );
  const isQueryEmpty = initialQuery.trim().length === 0;

  const [results, setResults] = useState<SearchItem[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setCategory] = useState<SearchCategory>(
    initialCategory as any
  );

  const reset = useCallback(() => {
    const isSearchRoute = window.location.pathname.startsWith(ROUTE.SEARCH());
    if (isSearchRoute) {
      const currentPath = ROUTE.SEARCH();
      window.history.replaceState({}, "", currentPath);
    }
    setResults([]);
  }, []);

  const isSearchingRef = useRef(false);
  const search = useRefreshApi(SearchApi.search);
  const handleSearch = useCallback(async () => {
    if (query.trim().length === 0) {
      reset();
      return;
    }
    setIsSearching(true);

    const currentPath = ROUTE.SEARCH(
      query,
      query.trim().length === 0 ? undefined : activeCategory
    );
    window.history.replaceState({}, "", currentPath);

    const { type, order } = TypeMap[activeCategory];
    const { success, data } = await search({ query, type, order });
    if (success && data) setResults(data.items ?? null);

    setIsSearching(false);
  }, [query, activeCategory, search, reset]);

  const handleRetry = useCallback(() => {
    if (isSearchingRef.current) return;
    (async function _search() {
      isSearchingRef.current = true;
      await handleSearch();
      isSearchingRef.current = false;
    })();
  }, [handleSearch]);

  useEffect(() => {
    if (isSearchingRef.current) return;
    (async function _search() {
      isSearchingRef.current = true;
      await handleSearch();
      isSearchingRef.current = false;
    })();
  }, [query, activeCategory, handleSearch]);

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
    <div className="size-full">
      <div className="relative">
        <PageHeader title="Search" className="absolute top-0 z-10 w-full">
          <div
            className={cn(
              "px-3 pb-3",
              "border-b",
              isQueryEmpty ? "border-border" : "border-transparent"
            )}
          >
            <SearchInput
              id="side-search-input"
              defaultValue={initialQuery}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(event.target.value)
              }
            />
          </div>
          {!isQueryEmpty && (
            <NavigationBar items={categories} initialValue={activeCategory} />
          )}
        </PageHeader>
      </div>

      <div className="h-full">
        {isQueryEmpty ? (
          <EmptySearchView />
        ) : (
          <SearchResults
            results={results}
            type={activeCategory}
            loading={isSearching}
            onError={handleRetry}
          />
        )}
      </div>
    </div>
  );
}
