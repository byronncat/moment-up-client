import { cn } from "@/lib/utils";

export default function SectionHeader({ children, className }: ComponentProps) {
  return (
    <div className={cn("flex items-center justify-between", "px-2", className)}>
      <span className="text-sm font-semibold text-muted-foreground">
        {children}
      </span>
      <button
        className={cn(
          "text-xs font-semibold",
          "cursor-pointer hover:opacity-60",
          "transition-opacity duration-150 ease-in-out"
        )}
      >
        Show more
      </button>
    </div>
  );
}
