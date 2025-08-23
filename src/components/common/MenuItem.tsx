import { cn } from "@/libraries/utils";

export default function MenuItem({
  icon,
  label,
  description,
}: Readonly<{ icon: React.ReactNode; label: string; description?: string }>) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center",
          "size-8 rounded-full",
          "text-foreground/70 dark:text-foreground",
          "bg-accent/10 dark:bg-accent/10"
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        {description && (
          <div className="text-xs dark:text-muted-foreground">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
