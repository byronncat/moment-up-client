import { cn } from "@/libraries/utils";
import { Brand } from "@/components/common";
import { AsideBackground, ThemeSelection } from "./_components";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("w-screen h-svh", "flex")}>
      <AsideBackground
        className={cn("min-w-[460px] grow", "hidden lg:block")}
      />
      <div
        className={cn("size-full lg:max-w-(--breakpoint-md) grow", "relative")}
      >
        <div
          className={cn(
            "flex justify-between items-center",
            "h-14 px-3",
            "absolute top-0 left-0 right-0"
          )}
        >
          <Brand className="h-9 select-none" />
          <ThemeSelection />
        </div>
        <div className={cn("h-full", "flex justify-center items-center")}>
          {children}
        </div>
      </div>
    </div>
  );
}
