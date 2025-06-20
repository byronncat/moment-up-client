import { CoreApi } from "@/services";
import MomentDetails from "./_components";

export default async function MomentPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const momentRes = CoreApi.getMoment(id);

  return <MomentDetails initialRes={momentRes} />;
}
