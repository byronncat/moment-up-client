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
import { useCallback, useEffect, useState, useTransition } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useRefreshApi } from "@/components/providers";
import { toast } from "sonner";
import { SearchApi } from "@/services";
import { SearchHistory } from "@/utilities";
import { SEARCH_DEBOUNCE_TIME } from "@/constants/client";
import { INITIAL_PAGE, type SearchItemType } from "@/constants/server";

const MAX_ITEMS = 11;

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useDebounceValue("", SEARCH_DEBOUNCE_TIME);
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [history, setHistory] = useState<SearchItem[] | null>(null);
  const [isSearching, setSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  const callSearchApi = useRefreshApi(SearchApi.search);

  const reset = useCallback(() => {
    setItems(null);
    setHistory(null);
    setSearching(false);
  }, []);

  const addHistory = useCallback((item: SearchItem, type: SearchItemType) => {
    const next = SearchHistory.add(item, type, MAX_ITEMS);
    setHistory(next);
  }, []);

  const removeHistory = useCallback((itemId: string) => {
    const next = SearchHistory.remove(itemId);
    setHistory(next);
  }, []);

  const clearHistory = useCallback(() => {
    SearchHistory.clear();
    setHistory([]);
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();
    let cancelled = false;
    if (!trimmedQuery) {
      startTransition(() => {
        if (cancelled) return;
        setHistory(SearchHistory.get(MAX_ITEMS));
      });
      return;
    }

    startTransition(async () => {
      await callSearchApi({
        query: trimmedQuery,
        filter: "user",
        page: INITIAL_PAGE,
        limit: MAX_ITEMS,
      }).then(({ success, data, message }) => {
        if (cancelled) return;

        if (success) setItems((data?.items as SearchItem[]) ?? []);
        else toast.error(message ?? "Failed to perform search.");
      });
    });

    return () => {
      cancelled = true;
    };
  }, [isSearching, query, callSearchApi]);

  return {
    query,
    items: query ? items : history,
    isLoading: isPending,
    isSearching,
    setQuery,
    setSearching,
    addHistory,
    removeHistory,
    clearHistory,
    reset,
  };
}
