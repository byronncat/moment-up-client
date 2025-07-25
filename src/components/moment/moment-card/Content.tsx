"use client";

import type { MomentInfo } from "api";

import TextContent from "./Text";
import MediaGrid from "./media-grid";

type ContentProps = Readonly<{
  momentId: MomentInfo["id"];
  postData: MomentInfo["post"];
}>;

export default function Content({ momentId, postData }: ContentProps) {
  return (
    <div>
      <TextContent
        text={postData.text}
        hasFiles={!!postData.files?.length}
        momentId={momentId}
      />
      <MediaGrid files={postData.files} momentId={momentId} />
    </div>
  );
}
