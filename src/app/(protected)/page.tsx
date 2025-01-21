import { mockMoments } from "@/__mocks__";
import { MomentCard } from "@/components/moment";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className={cn("size-full", "pt-5 pb-10 space-y-3")}>
      {mockMoments.map((moment) => (
        <MomentCard key={moment.id} data={moment} />
      ))}
    </div>
  );
}
