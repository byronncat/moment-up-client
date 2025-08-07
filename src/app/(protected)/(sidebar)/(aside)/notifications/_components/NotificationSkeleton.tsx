import { cn } from "@/libraries/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 3 }).map((_, index) => (
        <NotificationItemSkeleton key={index} />
      ))}
    </div>
  );
}

export function NotificationItemSkeleton({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className={cn("p-4 flex", "border-b border-border", className)}>
      <div className="mr-3">
        <Skeleton className="size-12 rounded-full" />
      </div>
      <div className="grow min-w-0 space-y-2 pt-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}
