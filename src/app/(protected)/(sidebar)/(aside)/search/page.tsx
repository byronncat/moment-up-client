"use client";

import type { SearchItem, PaginationInfo } from "api";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";
import useSWRInfinite from "swr/infinite";
import { useRefreshSWR, useAuth } from "@/components/providers";
import { ApiUrl, SearchTypeParams, SearchSortParams } from "@/services";
import { SEARCH_DEBOUNCE_TIME, SearchCategory } from "@/constants/client";
import { ROUTE, SearchParamName } from "@/constants/route";
import { INITIAL_PAGE } from "@/constants/server";

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

  const [activeCategory, setCategory] = useState<SearchCategory>(
    initialCategory as any
  );

  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();

  const getKey = useCallback(
    (
      pageIndex: number,
      previousPageData: PaginationInfo<SearchItem> | null
    ) => {
      if (query.trim().length === 0) return null;
      if (previousPageData && !previousPageData.hasNextPage) return null;

      const { type, order } = TypeMap[activeCategory];
      const url = ApiUrl.search.search(query, type, order, pageIndex + 1);
      return [url, token.accessToken];
    },
    [query, activeCategory, token.accessToken]
  );

  const { data, size, setSize, isLoading, isValidating, mutate, error } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationInfo<SearchItem>>(url, accessToken),
      {
        initialSize: INITIAL_PAGE,
        revalidateFirstPage: false,
      }
    );

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : false;
  const allResults = useMemo(() => {
    return data ? data.flatMap((page) => page?.items || []) : null;
  }, [data]);

  const handleLoadNextPage = useCallback(async () => {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }, [hasNextPage, isValidating, setSize, size]);

  const handleRetry = useCallback(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    const isSearchRoute = window.location.pathname.includes(ROUTE.SEARCH());
    if (!isSearchRoute) return;

    const currentPath = ROUTE.SEARCH(
      query,
      query.trim().length === 0 ? undefined : activeCategory
    );
    window.history.replaceState({}, "", currentPath);
  }, [query, activeCategory]);

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
            results={allResults}
            type={activeCategory}
            loading={isLoading}
            error={error}
            isValidating={isValidating}
            hasNextPage={hasNextPage}
            loadNextPage={handleLoadNextPage}
            onError={handleRetry}
          />
        )}
      </div>
    </div>
  );
}
