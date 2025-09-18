import { cache } from "react";
import { CoreApi } from "@/services";
import MomentDetails from "./_components";
import { Metadata } from "@/constants/metadata";

const MAX_TEXT_LENGTH = 20;

const getMomentCached = cache((id: string) => {
  return CoreApi.getMoment(id);
});

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const { data } = await getMomentCached(id);
  if (!data) return Metadata.root;

  const text =
    data.post.text && data.post.text.length > MAX_TEXT_LENGTH
      ? `${data.post.text?.slice(0, MAX_TEXT_LENGTH)}...`
      : data.post.text;
  return Metadata.moment(data.user.username, text);
}

export default async function MomentPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const momentRes = getMomentCached(id);

  return <MomentDetails initialRes={momentRes} />;
}
