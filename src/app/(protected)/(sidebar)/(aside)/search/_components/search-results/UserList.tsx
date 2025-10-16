import type { UserSearchItem } from "api";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useSearch } from "../../_providers/Search";
import { SearchItemType } from "@/constants/server";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { ErrorContent, NoContent } from "@/components/common";
import { MagnifyingGlass } from "@/components/icons";
import SearchItem from "../../../_components/search/SearchItem";
import LoadingIndicator from "../LoadingIndicator";

export default function MixedVirtualList() {
  const router = useRouter();
  const {
    results,
    error,
    isLoading,
    isValidating,
    isQueryEmpty,
    hasNextPage,
    loadNextPage,
    refresh,
  } = useSearch();

  const itemCount = results
    ? results.length === 0 || error
      ? 1
      : results.length + (hasNextPage ? 1 : 0)
    : isLoading
      ? 1
      : 0;

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 5,
    estimateSize: () => 72,
  });
  const virtualItems = virtualizer.getVirtualItems();

  function handleClick(item: UserSearchItem) {
    router.push(ROUTE.PROFILE(item.username));
  }

  useEffect(() => {
    if (!results) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (lastItem.index >= results.length - 1 && hasNextPage && !isValidating)
      loadNextPage();
  }, [results, virtualItems, hasNextPage, isValidating, loadNextPage]);

  if (isQueryEmpty) return null;
  return (
    <div className="size-full">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {virtualItems.map((vItem) => {
          const isLoaderRow = hasNextPage && vItem.index === itemCount - 1;
          const item = results?.[vItem.index];

          return (
            <div
              key={vItem.key}
              data-index={vItem.index}
              ref={(element) => virtualizer.measureElement(element)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vItem.start}px)`,
              }}
            >
              {isLoading ? (
                <LoadingIndicator />
              ) : error ? (
                <ErrorContent
                  onRefresh={() => refresh()}
                  className="pt-16 pb-20"
                />
              ) : results === undefined ? null : results.length === 0 ? (
                <NoContent
                  icon={
                    <MagnifyingGlass className="size-14 mb-1 text-muted-foreground" />
                  }
                  title="No results found"
                  description="Try searching for something else."
                  className="pt-16 pb-20"
                />
              ) : isLoaderRow ? (
                <LoadingIndicator />
              ) : item ? (
                <SearchItem
                  data={item}
                  onClick={() => handleClick(item as UserSearchItem)}
                  className={cn(
                    item.type === SearchItemType.USER &&
                      "cursor-pointer hover:bg-accent/5 px-4 py-3 transition-colors"
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
