import { cn } from "@/libraries/utils";
import Aside from "./_components/aside";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("flex gap-12", "size-full flex justify-center")}>
      <div className={cn("size-full max-w-[642px]", "border-x border-border")}>
        {children}
      </div>
      <Aside className={cn("pt-5 sticky top-0", "hidden lg:block")} />
    </div>
  );
}
