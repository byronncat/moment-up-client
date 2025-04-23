import { cn } from "@/lib/utils";
import ModeSelection from "@/components/others/ModeSelection";
import Brand from "@/components/others/Brand";
import { AsideBackground } from "./_components";

export default async function Layout({ children }: LayoutProps) {
  return (
    <div className={cn("w-screen h-screen", "flex")}>
      <AsideBackground />
      <div
        className={cn(
          "size-full lg:max-w-(--breakpoint-md)",
          "shrink-0",
          "relative"
        )}
      >
        <div
          className={cn(
            "flex justify-between items-center",
            "h-14 px-3",
            "absolute top-0 left-0 right-0"
          )}
        >
          <Brand className="h-9 select-none" hyperlink={false} />
          <ModeSelection />
        </div>
        <div className={cn("h-full", "flex justify-center items-center")}>
          {children}
        </div>
      </div>
    </div>
  );
}
