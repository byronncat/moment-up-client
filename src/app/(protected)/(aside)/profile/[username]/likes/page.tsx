import { mockMoments } from "@/__mocks__";

import { cn } from "@/libraries/utils";
import { MomentCard } from "@/components/moment";

export default function LikesPage() {
  return (
    <div className={cn("flex flex-col gap-4", "px-3 sm:px-0")}>
      {mockMoments.map((moment) => (
        <MomentCard key={moment.id} data={moment} />
      ))}
    </div>
  );
}
