import type { QuerySearchItem, UserSearchItem } from "api";
import { LocalStorageKey } from "@/constants/client";
import { SearchItemType } from "@/constants/server";

export type SearchItem = QuerySearchItem | UserSearchItem;

function safeRead(): SearchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LocalStorageKey.SEARCH_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SearchItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(items: SearchItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LocalStorageKey.SEARCH_HISTORY,
      JSON.stringify(items)
    );
  } catch {
    // ignore write errors
  }
}

export const SearchHistory = {
  get(limit?: number): SearchItem[] {
    const items = safeRead();
    if (typeof limit === "number") return items.slice(0, limit);
    return items;
  },

  set(items: SearchItem[]): void {
    safeWrite(items);
  },

  add(item: SearchItem, type: SearchItemType, limit?: number): SearchItem[] {
    const current = safeRead();

    const isSameItem = (a: SearchItem, b: SearchItem) => {
      if (type === SearchItemType.USER)
        return (
          a.type === SearchItemType.USER &&
          b.type === SearchItemType.USER &&
          a.id === b.id
        );
      if (type === SearchItemType.QUERY)
        return (
          a.type === SearchItemType.QUERY &&
          b.type === SearchItemType.QUERY &&
          a.query === b.query
        );
      return false;
    };

    const withoutDup = current.filter((h) => !isSameItem(h, item));
    const next = [item, ...withoutDup];
    const capped = typeof limit === "number" ? next.slice(0, limit) : next;
    safeWrite(capped);
    return capped;
  },

  remove(itemId: string): SearchItem[] {
    const current = safeRead();
    const next = current.filter(
      (item) =>
        (item.type === SearchItemType.USER && item.id !== itemId) ||
        (item.type === SearchItemType.QUERY && item.query !== itemId)
    );
    safeWrite(next);
    return next;
  },

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(LocalStorageKey.SEARCH_HISTORY);
    } catch {
      // ignore errors
    }
  },
} as const;
