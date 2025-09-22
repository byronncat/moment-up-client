import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { Circle, RotateCw } from "@/components/icons";

type ErrorContentProps = Readonly<{
  icon?: React.ReactNode;
  hiddenIcon?: boolean;
  title?: string;
  description?: string;
  onRefresh?: () => void;
  className?: string;
}>;

export default function ErrorContent({
  icon,
  hiddenIcon = false,
  title = "Something went wrong!",
  description = "Please try again later.",
  onRefresh,
  className,
}: ErrorContentProps) {
  return (
    <div className={cn("flex flex-col items-center", "h-full px-5", className)}>
      {hiddenIcon
        ? null
        : (icon ?? (
            <Circle
              variant="exclamation"
              className="size-12 fill-red-500 dark:fill-red-400"
            />
          ))}
      <span className={cn("text-lg font-medium", "mt-3")}>{title}</span>
      <span className={cn("text-sm text-muted-foreground", "mt-0.5")}>
        {description}
      </span>
      {onRefresh ? (
        <Button
          variant="outline"
          size="sm"
          className={cn("mt-4")}
          onClick={onRefresh}
        >
          <RotateCw className="size-4" />
          Refresh
        </Button>
      ) : null}
    </div>
  );
}
