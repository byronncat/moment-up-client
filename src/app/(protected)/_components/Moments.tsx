"use client";

import { mockMoments } from "@/__mocks__";
import { MomentCard } from "@/components/moment";

export default function Moments() {
  return (
    <div className="flex flex-col gap-4">
      {mockMoments.map((moment) => (
        <MomentCard key={moment.id} data={moment} />
      ))}
    </div>
  );
}
