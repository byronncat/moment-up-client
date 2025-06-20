import { cache } from "react";
import { CoreApi } from "@/services";
import MomentDetails from "./_components";
import { Metadata } from "@/constants/metadata";

const getMomentCached = cache(async (id: string) => {
  return CoreApi.getMoment(id);
});

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const momentRes = await getMomentCached(id);
  if (!momentRes.data) return Metadata.root;
  return Metadata.moment(
    momentRes.data.user.username,
    momentRes.data.post.text
  );
}

export default async function MomentPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const momentRes = getMomentCached(id);

  return <MomentDetails initialRes={momentRes} />;
}
