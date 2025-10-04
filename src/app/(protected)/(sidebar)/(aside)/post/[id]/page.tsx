import { CoreApi } from "@/services";
import { Metadata } from "@/constants/metadata";
import PostDetails from "./_components";

const MAX_TEXT_LENGTH = 20;

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  const { data } = await CoreApi.getPostMetadata(id);
  if (!data) return null;

  const text =
    data.text && data.text.length > MAX_TEXT_LENGTH
      ? `${data.text?.slice(0, MAX_TEXT_LENGTH)}...`
      : data.text;
  return Metadata.post(data.username, text);
}

export default async function PostDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  return <PostDetails postId={id} />;
}
