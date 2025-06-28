import { CoreApi } from "@/services";
import { MomentList } from "../../_components";

export default function MomentPage() {
  const momentsRes = CoreApi.explore("moments", 0);

  return (
    <div className="max-w-[600px] size-full mx-auto">
      <MomentList initialRes={momentsRes} />
    </div>
  );
}
