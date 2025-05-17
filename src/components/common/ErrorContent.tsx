import { cn } from "@/libraries/utils";
import { Button } from "@/components/ui/button";
import { CircleExclamation } from "@/components/icons";
import { RotateCw } from "lucide-react";

export default function ErrorContent({
  onRefresh,
}: Readonly<{
  onRefresh: () => void;
}>) {
  return (
    <div className={cn("flex flex-col items-center justify-center", "h-full")}>
      <CircleExclamation className="size-12 fill-red-500 dark:fill-red-400" />
      <p className={cn("text-lg font-medium", "mt-4")}>Something went wrong!</p>
      <p className={cn("text-sm text-muted-foreground", "mt-1")}>
        Please try again later.
      </p>
      <Button
        variant="outline"
        size="sm"
        className={cn("mt-4")}
        onClick={onRefresh}
      >
        <RotateCw />
        Refresh
      </Button>
    </div>
  );
}
