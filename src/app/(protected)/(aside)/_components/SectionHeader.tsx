import { cn } from "@/libraries/utils";
import { Skeleton } from "@/components/ui/skeleton";

type SectionHeaderProps = ComponentProps<{
  loading?: boolean;
}>;

export default function SectionHeader({
  children,
  className,
  loading,
}: SectionHeaderProps) {
  if (loading) {
    return (
      <div
        className={cn("flex items-center justify-between", "px-2", className)}
      >
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }
  return (
    <div className={cn("flex items-center justify-between", "px-2", className)}>
      <span className="text-sm font-semibold text-muted-foreground">
        {children}
      </span>
      <button
        className={cn(
          "text-xs font-semibold",
          "cursor-pointer hover:opacity-80",
          "transition-opacity duration-150 ease-in-out"
        )}
      >
        Show more
      </button>
    </div>
  );
}
