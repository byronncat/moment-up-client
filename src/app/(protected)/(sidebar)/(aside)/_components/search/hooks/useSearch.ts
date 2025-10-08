// === Type ===
import type { QuerySearchItem, UserSearchItem } from "api";

export type SearchItem = QuerySearchItem | UserSearchItem;

interface UseSearchState {
  items: SearchItem[] | null;
  query: string;
  isSearching: boolean;
  isLoading: boolean;
}

interface UseSearchActions {
  setQuery: (query: string) => void;
  setSearching: (isSearching: boolean) => void;
  addHistory: (item: SearchItem, type: SearchItemType) => void;
  removeHistory: (itemId: string) => void;
  clearHistory: () => void;
  reset: () => void;
}

type UseSearchReturn = UseSearchState & UseSearchActions;

// === Hook ===
import { useState, useEffect, useCallback } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useRefreshApi } from "@/components/providers";
import { toast } from "sonner";
import { SearchApi } from "@/services";
import { SearchHistory } from "@/utilities";
import { SEARCH_DEBOUNCE_TIME } from "@/constants/client";
import { SearchItemType, INITIAL_PAGE } from "@/constants/server";

const MAX_ITEMS = 11;

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useDebounceValue("", SEARCH_DEBOUNCE_TIME);
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [isSearching, setSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function reset() {
    setItems(null);
    setSearching(false);
  }

  const callSearchApi = useRefreshApi(SearchApi.search);
  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);

    const { success, data } = await callSearchApi({
      query,
      filter: "user",
      order: "most_popular",
      page: INITIAL_PAGE,
      limit: MAX_ITEMS,
    });
    if (success) setItems((data?.items as SearchItem[]) ?? []);
    else toast.error("Failed to perform search");
    setIsLoading(false);
  }, []);

  const getHistory = useCallback(async () => {
    const history = SearchHistory.get(MAX_ITEMS);
    setItems(history);
  }, []);

  const addHistory = useCallback(
    async (item: SearchItem, type: SearchItemType) => {
      const next = SearchHistory.add(item as any, type, MAX_ITEMS);
      setItems(next);
    },
    []
  );

  const removeHistory = useCallback(async (itemId: string) => {
    const next = SearchHistory.remove(itemId);
    setItems(next);
  }, []);

  const clearHistory = useCallback(async () => {
    SearchHistory.clear();
    setItems([]);
  }, []);

  useEffect(() => {
    if (query) search(query);
    else if (isSearching) getHistory();
  }, [query, isSearching, getHistory, search]);

  return {
    query,
    items,
    isLoading,
    isSearching,
    setQuery,
    setSearching,
    addHistory,
    removeHistory,
    clearHistory,
    reset,
  };
}
