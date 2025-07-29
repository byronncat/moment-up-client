import { cn } from "@/libraries/utils";
import { Skeleton } from "@/components/ui/skeleton";

type SectionHeaderProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export default function SectionHeader({
  children,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", "px-2", className)}>
      <span className="text-sm font-semibold text-muted-foreground">
        {children}
      </span>
    </div>
  );
}

export function HeaderSkeleton({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className={cn("flex items-center justify-between", "px-2", className)}>
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
