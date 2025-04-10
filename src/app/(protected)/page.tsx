import { cn } from "@/lib/utils";
import { Feeds, Moments } from "./_components";

export default function HomePage() {
  return (
    <div className={cn("flex flex-col", "pt-5 pb-10 px-3")}>
      <div className={cn("w-full self-center", "mb-4")}>
        <Feeds />
      </div>
      <Moments />
    </div>
  );
}
