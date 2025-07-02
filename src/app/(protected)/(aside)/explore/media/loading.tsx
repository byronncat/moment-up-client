import { cn } from "@/libraries/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TOP_PADDING, CELL_GAP } from "../../_constants/spacing";

export default function Loading() {
  return (
    <div
      className={cn("grid grid-cols-3", "gap-1 px-1 max-laptop:pt-[49px]!")}
      style={{ paddingTop: TOP_PADDING + CELL_GAP }}
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton key={index} className="aspect-square rounded-none" />
      ))}
    </div>
  );
}
