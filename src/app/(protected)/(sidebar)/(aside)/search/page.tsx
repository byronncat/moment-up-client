"use client";

import type { SearchResult } from "api";

import { useSearchParams } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useRefreshApi } from "@/components/providers";
import { SearchApi, SearchTypeParams } from "@/services";
import { SEARCH_DEBOUNCE_TIME, SearchCategory } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import {
  NavigationBar,
  VirtualScrollbar,
  type NavItem,
} from "@/components/common";
import { PageHeader, SearchInput } from "../_components";
import { SearchResults } from "./_components";
import NoSearchState from "./_components/NoSearchState";

export default function SearchPage() {
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

  const [height, setHeight] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);
  const updateScrollbarRef = useRef<(scrollTop: number) => void>(() => {});
  const containerRef = useRef<HTMLDivElement>(null);
  const handleCustomScroll = useCallback((newScrollTop: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = newScrollTop;
    }
  }, []);

  useEffect(() => {
    const updateHeights = () => {
      if (containerRef.current) {
        const newHeight = containerRef.current.clientHeight;
        const newTotalHeight = containerRef.current.scrollHeight;
        setHeight(newHeight);
        setTotalHeight(newTotalHeight);
      }
    };

    updateHeights();

    const handleResize = () => updateHeights();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [results, isSearching, query]); // Recalculate when content changes

  const search = useRefreshApi(SearchApi.search);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleSearch(type: SearchTypeParams) {
    if (isQueryEmpty()) return;

    setIsSearching(true);
    const { success } = await search({ query, type });
    // if (success) setResults((data as any) ?? null);
    if (success) setResults(null);
    setIsSearching(false);
  }

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
    <div className="size-full">
      <div className="relative">
        <PageHeader title="Search" className="absolute top-0 z-10 w-full">
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
      </div>

      <div
        ref={containerRef}
        className="pt-[128px] overflow-y-auto h-full scrollbar-hide relative"
        onScroll={(e) => {
          const scrollTop = e.currentTarget.scrollTop;
          updateScrollbarRef.current?.(scrollTop);
        }}
      >
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

      <VirtualScrollbar
        height={height}
        totalHeight={totalHeight}
        onScroll={handleCustomScroll}
        onScrollUpdate={(updateFn) => {
          updateScrollbarRef.current = updateFn;
        }}
        className="[@media(max-width:calc(640px+48px+32px))]:hidden"
      />
    </div>
  );
}
