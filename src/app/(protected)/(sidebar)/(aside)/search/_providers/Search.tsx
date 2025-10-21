"use client";

import type {
  ErrorDto,
  FeedItemDto,
  PaginationDto,
  PopularUserDto,
  SearchItem,
} from "api";

import { createContext, use, useCallback, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import useSWRInfinite from "swr/infinite";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { useAuth, usePost, useRefreshSWR } from "@/components/providers";
import { ApiUrl } from "@/services";
import { SWRInfiniteOptions } from "@/helpers/swr";
import { SEARCH_DEBOUNCE_TIME, SearchCategory } from "@/constants/client";
import { TypeMap } from "../_constants";

type SearchContextType = {
  rawQuery: string;
  query: string;
  activeCategory: SearchCategory;
  results: SearchItem[] | undefined;
  isQueryEmpty: boolean;
  isLoading: boolean;
  isValidating: boolean;
  error: ErrorDto | undefined;
  hasNextPage: boolean;

  setQuery: (value: string) => void;
  setCategory: (value: SearchCategory) => void;
  loadNextPage: () => Promise<void>;
  refresh: () => void;

  popularUsers: PopularUserDto[];
  isLoadingPopular: boolean;
  errorPopular: ErrorDto | undefined;
  refreshPopular: () => void;
};

const SearchContext = createContext<SearchContextType>({
  rawQuery: "",
  query: "",
  activeCategory: SearchCategory.PEOPLE,
  results: undefined,
  isQueryEmpty: false,
  isLoading: false,
  isValidating: false,
  error: undefined,
  hasNextPage: false,

  setQuery: () => {},
  setCategory: () => {},
  loadNextPage: () => Promise.resolve(),
  refresh: () => {},

  popularUsers: [],
  isLoadingPopular: false,
  errorPopular: undefined,
  refreshPopular: () => {},
});

export default function SearchProvider({
  initialQuery,
  initialCategory,
  children,
}: Readonly<{
  initialQuery: string;
  initialCategory: SearchCategory;
  children: React.ReactNode;
}>) {
  const swrFetcherWithRefresh = useRefreshSWR();
  const { token } = useAuth();
  const { setPosts } = usePost();

  const [rawQuery, setRawQuery] = useState(initialQuery);
  const [query] = useDebounceValue(rawQuery, SEARCH_DEBOUNCE_TIME);
  const [activeCategory, setActiveCategory] =
    useState<SearchCategory>(initialCategory);

  const isQueryEmpty = rawQuery.trim().length === 0;

  const getKey = useCallback(
    (pageIndex: number, previousPageData: PaginationDto<SearchItem> | null) => {
      if (query.trim().length === 0) return null;
      if (previousPageData && !previousPageData.hasNextPage) return null;

      const { filter } = TypeMap[activeCategory];
      const url = ApiUrl.search.search(query, filter, pageIndex + 1);
      return [url, token.accessToken];
    },
    [query, activeCategory, token.accessToken]
  );

  const { data, size, setSize, isLoading, isValidating, mutate, error } =
    useSWRInfinite(
      getKey,
      ([url, accessToken]) =>
        swrFetcherWithRefresh<PaginationDto<SearchItem>>(url, accessToken),
      SWRInfiniteOptions
    );

  const results =
    activeCategory === SearchCategory.POSTS ||
    activeCategory === SearchCategory.MEDIA
      ? undefined
      : data?.flatMap((page) => page?.items || []);

  const hasNextPage = data
    ? (data[data.length - 1]?.hasNextPage ?? false)
    : false;

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isValidating) await setSize(size + 1);
  }, [hasNextPage, isValidating, setSize, size]);

  useEffect(() => {
    const allResults = data?.flatMap((page) => page?.items || []);
    if (allResults && !error)
      if (
        activeCategory === SearchCategory.POSTS ||
        activeCategory === SearchCategory.MEDIA
      )
        setPosts(allResults as FeedItemDto[]);
      else setPosts(undefined);
  }, [data, error, activeCategory, setPosts]);

  // === Popular Users ===
  const {
    data: popularData,
    isLoading: isLoadingPopular,
    error: errorPopular,
    mutate: mutatePopular,
  } = useSWRImmutable(
    [ApiUrl.suggestion.popular, token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        users: PopularUserDto[];
      }>(url, token)
  );

  return (
    <SearchContext.Provider
      value={{
        rawQuery,
        query,
        activeCategory,
        results,
        isQueryEmpty,
        isLoading,
        isValidating,
        hasNextPage,
        error,

        setQuery: setRawQuery,
        setCategory: setActiveCategory,
        loadNextPage,
        refresh: mutate,

        popularUsers: popularData?.users ?? [],
        isLoadingPopular,
        errorPopular,
        refreshPopular: mutatePopular,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => use(SearchContext);
