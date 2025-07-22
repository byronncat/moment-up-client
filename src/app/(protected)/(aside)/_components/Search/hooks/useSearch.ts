import type { SearchItem } from "api";

import { useState, useEffect, useCallback } from "react";
import { useDebounceValue } from "usehooks-ts";
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
    clearAllItems();
    setIsSearching(false);
    setIsLoading(false);
  }

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);

    const { success, data: items } = await SearchApi.search({ query });
    if (success) setItems(items ?? []);
    else {
      setItems([]);
      toast.error("Failed to perform search");
    }

    setIsLoading(false);
  }, []);

  const fetchSearchHistory = useCallback(async () => {
    setIsLoading(true);

    const { success, data: items } = await SearchApi.getSearchHistory();
    if (success) setItems(items ?? []);
    else toast.error("Failed to load search history");

    setIsLoading(false);
  }, []);

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
