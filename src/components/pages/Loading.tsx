import { cn } from "@/lib/utils";
import Loader from "./Loader";
import Brand from "../others/Brand";

export default function LoadingPage() {
  return (
    <div className={cn("flex items-center justify-center", "h-screen")}>
      <Loader.BoxSpin />
      <div className={cn("absolute bottom-6", "flex flex-col items-center")}>
        <span className="text-muted-foreground text-sm font-medium">From</span>
        <Brand hyperlink={false} className="h-7" />
      </div>
    </div>
  );
}
