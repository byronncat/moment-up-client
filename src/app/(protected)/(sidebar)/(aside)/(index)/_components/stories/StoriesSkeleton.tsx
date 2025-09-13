import { cn } from "@/libraries/utils";
import { Skeleton } from "@/components/ui/skeleton";
import CreateStoryButton from "./CreateStoryButton";

export default function StorySkeletons({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className={cn("flex border-b border-border", className)}>
      <div className={cn("w-8", "border-r border-border")} />
      <div className={cn("flex gap-3", "pt-4 pb-2 grow")}>
        <CreateStoryButton />
        <StorySkeleton />
        <StorySkeleton />
        <StorySkeleton />
      </div>
      <div className={cn("w-8", "border-l border-border")} />
    </div>
  );
}

function StorySkeleton() {
  return (
    <div className={cn("flex flex-col items-center", "h-24")}>
      <div className={cn("flex items-center justify-center", "size-18")}>
        <Skeleton className="size-16 rounded-full" />
      </div>
      <Skeleton className="w-16 h-3 mt-0.5" />
    </div>
  );
}
