import type { SearchItem } from "api";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const loading = useRef({
    clear: false,
  });

  const remove = useRefreshApi(SearchApi.removeHistoryItem);
  async function removeItem(itemId: SearchItem["id"]) {
    if (!items) return;

    const originalIndex = items.findIndex((item) => item.id === itemId);
    const itemToDelete = items.find((item) => item.id === itemId);
    if (!itemToDelete || originalIndex === -1) return;

    setItems(items.filter((item) => item.id !== itemId));

    const { success } = await remove(itemId);
    if (!success) {
      setItems((currentItems) => {
        if (!currentItems) return [itemToDelete];

        const adjustedIndex = Math.min(originalIndex, currentItems.length);
        const newItems = [...currentItems];
        newItems.splice(adjustedIndex, 0, itemToDelete);

        return newItems;
      });

      toast.error("Failed to remove search item");
    }
  }

  const clearItems = useRefreshApi(SearchApi.clearHistory);
  async function clearAllItems() {
    if (loading.current.clear) return;
    loading.current.clear = true;
    const previousItems = items;
    setItems([]);

    const { success } = await clearItems();
    if (!success) {
      setItems(previousItems);
      toast.error("Failed to clear search history");
    }

    loading.current.clear = false;
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
      setItems(data ?? []);
      if (!success) toast.error("Failed to perform search");

      setIsLoading(false);
    },
    [searchQuery]
  );

  const getSearchHistory = useRefreshApi(SearchApi.getHistory);
  const fetchSearchHistory = useCallback(async () => {
    setIsLoading(true);

    const { success, data } = await getSearchHistory();
    setItems(data ?? []);
    if (!success) toast.error("Failed to load search history");

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
