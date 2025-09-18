import { cn } from "@/libraries/utils";

type MenuItemProps = Readonly<{
  icon: React.ReactNode;
  label: string;
  description?: string;
}>;

export default function MenuItem({ icon, label, description }: MenuItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex items-center justify-center",
          "size-8 rounded-full",
          "text-foreground/70 dark:text-foreground",
          "bg-accent/10 dark:bg-accent/10"
        )}
      >
        {icon}
      </span>
      <div className="flex flex-col flex-1">
        <span className="font-medium text-sm">{label}</span>
        {description ? (
          <span className="text-xs dark:text-muted-foreground">
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
}
