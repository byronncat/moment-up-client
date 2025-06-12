import { Aside } from "./_components";
import { cn } from "@/libraries/utils";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("flex gap-10", "size-full flex justify-center")}>
      <div className="size-full max-w-[640px]">{children}</div>
      <div className="hidden lg:block">
        <Aside className="pt-5" />
      </div>
    </div>
  );
}
