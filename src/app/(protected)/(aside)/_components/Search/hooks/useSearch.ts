import type { SearchItem } from "api";

import { useState, useEffect, useCallback } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useRefreshApi } from "@/components/providers";
import { toast } from "sonner";
import { SearchApi } from "@/services";
import { SEARCH_DEBOUNCE_TIME } from "@/constants/clientConfig";

interface UseSearchState {
  items: SearchItem[] | null;
  isSearching: boolean;
  isLoading: boolean;
  query: string;
}

interface UseSearchActions {
  setIsSearching: (isSearching: boolean) => void;
  setQuery: (query: string) => void;
  removeItem: (itemId: SearchItem["id"]) => void;
  clearAllItems: () => void;
  reset: () => void;
}

type UseSearchReturn = UseSearchState & UseSearchActions;

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useDebounceValue("", SEARCH_DEBOUNCE_TIME);
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function removeItem(itemId: SearchItem["id"]) {
    if (!items) return;
    setItems(items.filter((i) => i.id !== itemId));
  }

  function clearAllItems() {
    setItems([]);
  }

  function reset() {
    setItems(null);
    setIsSearching(false);
  }

  const searchQuery = useRefreshApi(SearchApi.search);
  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      setIsLoading(true);

      const { success, data } = await searchQuery({
        query,
        type: "user&hashtag",
      });
      if (success) setItems(data ?? []);
      else {
        setItems([]);
        toast.error("Failed to perform search");
      }

      setIsLoading(false);
    },
    [searchQuery]
  );

  const getSearchHistory = useRefreshApi(SearchApi.getSearchHistory);
  const fetchSearchHistory = useCallback(async () => {
    setIsLoading(true);

    const { success, data } = await getSearchHistory();
    if (success) setItems(data ?? []);
    else toast.error("Failed to load search history");

    setIsLoading(false);
  }, [getSearchHistory]);

  useEffect(() => {
    if (query) search(query);
    else if (isSearching) fetchSearchHistory();
  }, [query, isSearching, fetchSearchHistory, search]);

  return {
    isLoading,
    isSearching,
    setIsSearching,
    query,
    setQuery,
    items,
    removeItem,
    clearAllItems,
    reset,
  };
}
