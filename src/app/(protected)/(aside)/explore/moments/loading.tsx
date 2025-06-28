import { MomentSkeleton } from "@/components/moment";
import { TOP_PADDING, ITEM_GAP } from "../../_constants/spacing";

export default function Loading() {
  return (
    <div className="max-w-[600px] size-full mx-auto">
      <div
        className="flex flex-col gap-4 max-laptop:pt-[61px]!"
        style={{ paddingTop: TOP_PADDING + ITEM_GAP }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <MomentSkeleton key={index} haveText media="square" />
        ))}
      </div>
    </div>
  );
}
