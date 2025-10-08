"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SearchCategory } from "@/constants/client";
import { ROUTE, SearchParamName } from "@/constants/route";
import SearchProvider, { useSearch } from "./_Search.provider";

import { cn } from "@/libraries/utils";
import { NavigationBar, type NavItem } from "@/components/common";
import { PageHeader, SearchInput } from "../_components";
import { EmptySearchView, SearchResults } from "./_components";

function getInitialCategory(param: string): SearchCategory {
  const validCategories = Object.values(SearchCategory) as string[];
  return param && validCategories.includes(param)
    ? (param as SearchCategory)
    : SearchCategory.PEOPLE;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get(SearchParamName.QUERY) || "";
  const initialCategory = getInitialCategory(
    searchParams.get(SearchParamName.FILTER) || ""
  );

  return (
    <SearchProvider
      initialQuery={initialQuery}
      initialCategory={initialCategory}
    >
      <SearchPageContent />
    </SearchProvider>
  );
}

function SearchPageContent() {
  const { setQuery, setCategory, activeCategory, isQueryEmpty, query } =
    useSearch();

  // keep URL in sync with current search state
  useEffect(() => {
    const isSearchRoute = window.location.pathname.includes(ROUTE.SEARCH());
    if (!isSearchRoute || isQueryEmpty) return;

    const currentPath = ROUTE.SEARCH(
      query,
      query.trim().length === 0 ? undefined : activeCategory
    );
    window.history.replaceState({}, "", currentPath);
  }, [query, activeCategory, isQueryEmpty]);

  const categories: NavItem[] = [
    // {
    //   id: SearchCategory.TOP,
    //   label: "Top",
    //   onSelect: () => setCategory(SearchCategory.TOP),
    // },
    // {
    //   id: SearchCategory.LATEST,
    //   label: "Latest",
    //   onSelect: () => setCategory(SearchCategory.LATEST),
    // },
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
      id: SearchCategory.POSTS,
      label: "Posts",
      onSelect: () => setCategory(SearchCategory.POSTS),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Search"
        className={cn("w-full", "sticky top-0 left-0 z-10")}
      >
        <div
          className={cn(
            "px-3 pb-3 pt-3 mobile:pt-0",
            "mobile:border-b",
            isQueryEmpty ? "border-border" : "border-transparent"
          )}
        >
          <SearchInput
            id="side-search-input"
            defaultValue={""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(event.target.value)
            }
          />
        </div>
        {!isQueryEmpty && (
          <NavigationBar items={categories} initialValue={activeCategory} />
        )}
      </PageHeader>

      <main className="h-full">
        {isQueryEmpty ? (
          <EmptySearchView className="pt-2 mobile:pt-4" />
        ) : (
          <SearchResults />
        )}
      </main>
    </div>
  );
}
