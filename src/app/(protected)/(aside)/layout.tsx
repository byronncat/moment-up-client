import { Aside } from "./_components";
import { cn } from "@/libraries/utils";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={cn("flex gap-10", "h-full w-fit mx-auto")}>
      <div className="h-full w-[calc(37.5rem+2px)]">{children}</div>
      <Aside className="pt-5" />
    </div>
  );
}
