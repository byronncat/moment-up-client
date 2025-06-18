import { cn } from "@/libraries/utils";
import { Skeleton } from "@/components/ui/skeleton";
import CreateFeedButton from "./CreateFeedButton";

export default function FeedSkeletons() {
  return (
    <div className={cn("h-[144px]", "flex flex-col")}>
      <div className="flex grow">
        <div className={cn("w-8", "border-r border-border")} />
        <div className={cn("flex gap-3", "pt-4 pb-2 grow")}>
          <CreateFeedButton />
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
        </div>
        <div className={cn("w-8", "border-l border-border")} />
      </div>
      <div className={cn("h-6", "border-y border-border")} />
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className={cn("flex flex-col items-center", "h-24")}>
      <div className={cn("flex items-center justify-center", "size-18")}>
        <Skeleton className="size-16 rounded-full" />
      </div>
      <Skeleton className="w-16 h-3 mt-0.5" />
    </div>
  );
}
