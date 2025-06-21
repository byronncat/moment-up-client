import { cn } from "@/libraries/utils";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type MomentSkeletonProps = Readonly<{
  media?: "vertical" | "horizontal" | "square" | "none";
  haveText?: boolean;
}>;

export default function MomentSkeleton({
  media = "square",
  haveText = true,
}: MomentSkeletonProps) {
  let aspectRatio;
  switch (media) {
    case "vertical":
      aspectRatio = "aspect-[4/5]";
      break;
    case "horizontal":
      aspectRatio = "aspect-[1.91/1]";
      break;
    case "square":
      aspectRatio = "aspect-square";
      break;
    default:
      aspectRatio = "none";
      break;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex gap-2">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-col gap-1 mt-1 flex-1">
            <div className="flex items-center gap-1">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-1 h-3" />
              <Skeleton className="w-16 h-3" />
            </div>
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {haveText && (
          <div className="px-4 pb-2">
            {aspectRatio === "none" ? (
              <div className="pb-7">
                <Skeleton className="w-full h-4 mb-1" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ) : (
              <Skeleton className="w-4/5 h-4 mb-1" />
            )}
          </div>
        )}

        {aspectRatio !== "none" && (
          <Skeleton className={cn("w-full rounded-none", aspectRatio)} />
        )}
      </CardContent>

      <CardFooter className="px-4 py-3">
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
