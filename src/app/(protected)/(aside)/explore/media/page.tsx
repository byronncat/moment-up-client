import { CoreApi } from "@/services";
import { MomentGrid } from "../../_components";

export default function MediaPage() {
  const mediaRes = CoreApi.explore("media", 0);

  return <MomentGrid initialRes={mediaRes} />;
}
