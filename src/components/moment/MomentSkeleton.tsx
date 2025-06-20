import { cn } from "@/libraries/utils";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type MomentSkeletonProps = Readonly<{
  variant: "vertical" | "horizontal" | "square";
}>;

export default function MomentSkeleton({ variant }: MomentSkeletonProps) {
  const aspectRatio =
    variant === "vertical"
      ? "aspect-4/5"
      : variant === "horizontal"
        ? "aspect-[1.91/1]"
        : "aspect-square";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3">
        <div className="flex gap-2 mt-1">
          <Skeleton className="size-12 rounded-full" />
          <div className={cn("flex flex-col gap-1", "mt-1")}>
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-3" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-1">
        <Skeleton className="w-full h-4 my-1" />
        <Skeleton className="w-3/4 h-4 my-1" />
      </CardContent>

      <CardContent className="p-0">
        <Skeleton className={cn("w-full rounded-none", aspectRatio)} />
      </CardContent>

      <CardFooter className="p-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="w-10 h-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="w-10 h-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="w-10 h-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
