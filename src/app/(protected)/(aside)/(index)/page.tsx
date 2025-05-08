import { cn } from "@/libraries/utils";
import { Feeds, Moments } from "./_components";
import { Metadata } from "@/constants/metadata";

export const metadata = Metadata.home;
export default function HomePage() {
  return (
    <div className={cn("flex flex-col h-full", "pt-5 pb-5 sm:pb-10 px-3")}>
      <Feeds className="mb-4" />
      {/* <Moments /> */}
    </div>
  );
}
