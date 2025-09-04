import type { SearchItem } from "api";

import { useState, useEffect, useCallback } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useRefreshApi } from "@/components/providers";
import { toast } from "sonner";
import { SearchApi } from "@/services";
import { SEARCH_DEBOUNCE_TIME } from "@/constants/client";
import { INITIAL_PAGE } from "@/constants/server";

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

const MAX_ITEMS = 5;

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useDebounceValue("", SEARCH_DEBOUNCE_TIME);
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const remove = useRefreshApi(SearchApi.removeHistoryItem);
  async function removeItem(itemId: SearchItem["id"]) {
    if (!items) return;

    const originalIndex = items.findIndex((item) => item.id === itemId);
    const itemToDelete = items.find((item) => item.id === itemId);
    if (!itemToDelete || originalIndex === -1) return;

    setItems(items.filter((item) => item.id !== itemId));

    const { success, message } = await remove(itemId);
    if (!success) {
      setItems((currentItems) => {
        if (!currentItems) return [itemToDelete];

        const adjustedIndex = Math.min(originalIndex, currentItems.length);
        const newItems = [...currentItems];
        newItems.splice(adjustedIndex, 0, itemToDelete);

        return newItems;
      });

      toast.error(message || "Failed to remove search item");
    }
  }

  const clearItems = useRefreshApi(SearchApi.clearHistory);
  async function clearAllItems() {
    const previousItems = items;
    setItems([]);

    const { success, message } = await clearItems();
    if (!success) {
      setItems(previousItems);
      toast.error(message || "Failed to clear search history");
    }
  }

  function reset() {
    setItems(null);
    setIsSearching(false);
  }

  const callSearchApi = useRefreshApi(SearchApi.search);
  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      setIsLoading(true);

      const { success, data } = await callSearchApi({
        query,
        type: "user&hashtag",
        order: "most_popular",
        page: INITIAL_PAGE,
        limit: MAX_ITEMS,
      });
      setItems(data?.items ?? []);
      if (!success) toast.error("Failed to perform search");

      setIsLoading(false);
    },
    [callSearchApi]
  );

  const callSearchHistoryApi = useRefreshApi(SearchApi.getHistory);
  const getHistory = useCallback(async () => {
    setIsLoading(true);

    const { success, data } = await callSearchHistoryApi();
    setItems(data ?? []);
    if (!success) toast.error("Failed to load search history");

    setIsLoading(false);
  }, [callSearchHistoryApi]);

  useEffect(() => {
    if (query) search(query);
    else if (isSearching) getHistory();
  }, [query, isSearching, getHistory, search]);

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
