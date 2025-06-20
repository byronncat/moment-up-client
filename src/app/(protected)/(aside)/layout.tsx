import { Aside } from "./_components";
import { cn } from "@/libraries/utils";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("flex gap-10", "size-full flex justify-center")}>
      <div
        className={cn(
          "size-full max-w-[640px]",
          "[@media(min-width:calc(640px+48px+1px))]:border-x border-border"
        )}
      >
        {children}
      </div>
      <div className="hidden lg:block">
        <Aside className="pt-5" />
      </div>
    </div>
  );
}
