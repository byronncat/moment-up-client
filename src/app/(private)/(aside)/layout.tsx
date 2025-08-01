import { cn } from "@/libraries/utils";
import Aside from "./_components/Aside";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("flex gap-10", "size-full flex justify-center")}>
      <div
        className={cn(
          "size-full max-w-[642px] ",
          "[@media(min-width:calc(640px+48px+1px))]:border-x border-border"
        )}
      >
        <div className={cn("size-full max-w-[640px]")}>{children}</div>
      </div>
      <div className="hidden lg:block">
        <Aside className="pt-5" />
      </div>
    </div>
  );
}
