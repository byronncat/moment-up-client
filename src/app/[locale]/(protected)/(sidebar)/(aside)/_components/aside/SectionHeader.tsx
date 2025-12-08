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
    <h2
      className={cn(
        "flex items-center justify-between",
        "px-2",
        "text-sm font-semibold text-muted-foreground",
        className
      )}
    >
      {children}
    </h2>
  );
}
