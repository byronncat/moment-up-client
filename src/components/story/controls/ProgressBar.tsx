import { cn } from "@/libraries/utils";

type ProgressBarProps = Readonly<{
  total: number;
  current: number;
  progress: number;
  onSegmentClick: (index: number) => void;
  className?: string;
}>;

export default function ProgressBar({
  total,
  current,
  progress,
  onSegmentClick,
  className,
}: ProgressBarProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: total }).map((_, index) => {
        const isCurrent = index === current;

        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={cn(
              "bg-white/40",
              "flex-1 h-1",
              "rounded-full overflow-hidden",
              !isCurrent && "cursor-pointer"
            )}
            onClick={() => {
              if (isCurrent) return;
              onSegmentClick(index);
            }}
          >
            <div
              className={cn(
                "bg-white",
                "h-full rounded-full",
                "transition-all duration-75 ease-linear"
              )}
              style={{
                width: isCurrent
                  ? `${progress}%`
                  : index < current
                    ? "100%"
                    : "0%",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
