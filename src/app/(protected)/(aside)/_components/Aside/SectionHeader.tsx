import { cn } from "@/libraries/utils";

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
