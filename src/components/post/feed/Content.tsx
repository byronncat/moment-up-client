"use client";

import type { FeedItemDto } from "api";

import TextContent from "./Text";
import MediaGrid from "./media-grid";

type ContentProps = Readonly<{
  postId: FeedItemDto["id"];
  postData: FeedItemDto["post"];
}>;

export default function Content({ postId, postData }: ContentProps) {
  return (
    <div>
      <TextContent text={postData.text} hasFiles={!!postData.files?.length} />
      <MediaGrid postId={postId} files={postData.files} />
    </div>
  );
}
