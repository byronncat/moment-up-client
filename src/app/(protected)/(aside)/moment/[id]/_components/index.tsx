"use client";

import type { API, DetailedMomentInfo } from "api";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useLayoutEffect, useRef } from "react";
import { useMoment } from "@/components/providers";
import { ROUTE } from "@/constants/route";

import { CommentZone, MomentHeader } from "@/components/moment";
import { MomentButtonGroup, CommentDataProvider } from "@/components/moment";
import TextContent from "./TextContent";
import MediaCarousel from "./MediaCarousel";
import CommentInput from "./CommentInput";
import ScrollArea from "./ScrollArea";

type MomentDetailsProps = Readonly<{
  initialRes: API<DetailedMomentInfo | null>;
}>;

export default function MomentDetails({ initialRes }: MomentDetailsProps) {
  const momentRes = use(initialRes);
  const router = useRouter();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    setMoments,
    setCurrentIndex,
    follow,
    block,
    report,
    bookmark,
    share,
    like,
  } = useMoment();

  const moment = momentRes.data;
  const searchParams = useSearchParams();
  const imgIndex = searchParams.get("imgIndex");
  const initialIndex = imgIndex ? parseInt(imgIndex) : 0;

  useLayoutEffect(() => {
    setCurrentIndex(0);
    if (moment) setMoments([moment]);
  }, [moment, setMoments, setCurrentIndex]);

  if (!moment) return null;
  return (
    <ScrollArea>
      <MomentHeader
        data={moment}
        actions={{
          follow,
          report,
          block: async (momentId) => {
            await block(momentId, { remove: false });
            router.push(ROUTE.HOME);
          },
        }}
      />
      <TextContent data={moment.post.text} />
      <MediaCarousel
        files={moment.post.files}
        initialIndex={initialIndex}
        className="border-y border-border"
      />
      <MomentButtonGroup
        data={moment}
        className="border-b border-border"
        actions={{
          bookmark,
          share,
          like,
          comment: () => {
            commentInputRef.current?.focus();
          },
        }}
      />
      <CommentDataProvider momentId={moment.id}>
        <CommentInput ref={commentInputRef} />
        <CommentZone />
      </CommentDataProvider>
    </ScrollArea>
  );
}
