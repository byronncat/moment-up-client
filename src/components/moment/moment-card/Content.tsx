"use client";

import type { MomentInfo } from "api";
import type { Actions } from "../../providers/MomentData";

import TextContent from "./Text";
import MediaGrid from "./MediaGrid";

type ContentProps = Readonly<{
  momentId: MomentInfo["id"];
  postData: MomentInfo["post"];
  actions: Actions;
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
