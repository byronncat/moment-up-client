import { CoreApi } from "@/services";
import { Suspense } from "react";
import { Moments }from "./_components";

export default function HomePage() {
  const momentsRes = CoreApi.getMoments(1);
  return (
    <div className="size-full">
      {/* <Feeds className="mb-4" /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Moments initialRes={momentsRes} />
      </Suspense>
    </div>
  );
}

