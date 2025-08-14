import { cn } from "@/libraries/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommentSkeletons({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className={cn("px-4 py-3", className)}>
      <div className="mb-5">
        <Skeleton className="h-4 w-20 rounded" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
