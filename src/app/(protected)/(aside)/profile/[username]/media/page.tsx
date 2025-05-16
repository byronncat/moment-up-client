import { mockMoments } from "@/__mocks__";

import { cn } from "@/libraries/utils";
// import { MomentCell } from "@/components/moment";

export default function MediaPage() {
  return (
    <div className={cn("grid grid-cols-3 gap-1", "mt-5 w-full")}>
      {mockMoments.map((moment) => (
        // <MomentCell key={moment.id} data={moment} />
        <div key={moment.id}>{moment.id}</div>
      ))}
    </div>
  );
}
