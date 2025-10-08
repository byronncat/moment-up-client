import { useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { usePost } from "@/components/providers";
import { useSearch } from "../../_Search.provider";
import { POST_GRID_COLUMN_COUNT, POST_GRID_GAP } from "@/constants/client";
import { getMediaHeight } from "@/helpers/ui";

import { MediaCell } from "@/components/post";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorContent, NoContent } from "@/components/common";
import { MagnifyingGlass } from "@/components/icons";

export default function MediaGrid() {
  const { posts, setCurrentPost } = usePost();
  const { isLoading, isValidating, error, hasNextPage, loadNextPage, refresh } =
    useSearch();

  const remainder = posts ? posts.length % POST_GRID_COLUMN_COUNT : 0;
  const dataRowCount = posts
    ? Math.ceil(posts.length / POST_GRID_COLUMN_COUNT)
    : 0;
  const needsSkeletonRow = hasNextPage && remainder === 0;
  const skeletonRowCount = needsSkeletonRow ? 1 : 0;
  const itemCount = posts
    ? posts.length === 0 || error
      ? 1
      : dataRowCount + skeletonRowCount
    : isLoading
      ? 1
      : 0;

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    overscan: 3,
    gap: POST_GRID_GAP,
    paddingStart: POST_GRID_GAP,
    paddingEnd: 16,
    estimateSize: () => getMediaHeight(window.innerWidth),
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!posts) return;
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (lastItem.index >= dataRowCount - 1 && hasNextPage && !isValidating)
      loadNextPage();
  }, [
    posts,
    virtualItems,
    hasNextPage,
    isValidating,
    loadNextPage,
    dataRowCount,
  ]);

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
      }}
    >
      {virtualItems.map((vItem) => {
        const rowIndex = vItem.index;
        const startIndex = rowIndex * POST_GRID_COLUMN_COUNT;
        const isLoaderRow = hasNextPage && rowIndex === itemCount - 1;

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
              <div className="grid grid-cols-3 gap-1 px-1">
                {Array.from({ length: 9 }, (_, index) => (
                  <Skeleton
                    className="aspect-square rounded-none"
                    key={`loading-skeleton-${index}`}
                  />
                ))}
              </div>
            ) : error ? (
              <ErrorContent onRefresh={refresh} className="pt-15 pb-20" />
            ) : posts === undefined ? null : posts.length === 0 ? (
              <NoContent
                icon={
                  <MagnifyingGlass className="size-14 m-1 text-muted-foreground" />
                }
                title="No media found"
                description="Try searching for something else."
                className="pt-15 pb-20"
              />
            ) : isLoaderRow ? (
              <div className="flex justify-around gap-1 px-1">
                {Array.from(
                  { length: POST_GRID_COLUMN_COUNT },
                  (_, columnIndex) => (
                    <Skeleton
                      key={`skeleton-${columnIndex}`}
                      className="aspect-square rounded-none flex-1"
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex justify-around gap-1 px-1">
                {Array.from(
                  { length: POST_GRID_COLUMN_COUNT },
                  (_, columnIndex) => {
                    const post = posts?.[startIndex + columnIndex];
                    let content = null;

                    if (rowIndex < dataRowCount) {
                      if (post)
                        content = (
                          <MediaCell
                            data={post}
                            onClick={() => setCurrentPost(post.id)}
                          />
                        );
                      else if (
                        hasNextPage &&
                        remainder > 0 &&
                        rowIndex === dataRowCount - 1
                      )
                        content = (
                          <Skeleton className="aspect-square rounded-none flex-1" />
                        );
                    } else if (hasNextPage)
                      content = (
                        <Skeleton className="aspect-square rounded-none flex-1" />
                      );

                    return (
                      <div
                        key={`col-${vItem.index}-${columnIndex}`}
                        className="flex-1"
                      >
                        {content}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
