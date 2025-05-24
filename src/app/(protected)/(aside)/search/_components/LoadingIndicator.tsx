import { cn } from "@/libraries/utils";
import { Loader2 } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className={cn("py-12", "flex items-center justify-center gap-2")}>
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
