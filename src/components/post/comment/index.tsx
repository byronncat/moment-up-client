"use client";

import { useComment } from "@/components/providers";
import { cn } from "@/libraries/utils";
import { CommentSkeleton } from "./Skeleton";
import SortButton from "./SortButton";
import CommentList from "./list";

type CommentZoneProps = Readonly<{
  className?: string;
}>;

export default function CommentZone({ className }: CommentZoneProps) {
  const { comments, loading, hasNextPage, loadNextPage } = useComment();

  if (comments?.length === 0) return null;
  return (
    <div className={cn("px-4 py-3", className)}>
      <SortButton className="mb-4" />
      <div className="flex flex-col gap-4">
        <CommentList />
        {loading && (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        )}
      </div>
      {!loading && hasNextPage && (
        <button
          onClick={loadNextPage}
          className={cn(
            "mt-5",
            "text-sm text-muted-foreground font-semibold",
            "cursor-pointer hover:underline"
          )}
        >
          Load more...
        </button>
      )}
    </div>
  );
}
