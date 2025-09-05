"use client";

import type { CoreApi } from "@/services";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useLayoutEffect, useRef, useState } from "react";
import { CommentStorageProvider, useMoment } from "@/components/providers";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CommentZone,
  MomentButtonGroup,
  MomentHeader,
} from "@/components/moment";
import TextContent from "./TextContent";
import MediaCarousel from "./MediaCarousel";
import CommentInput from "./CommentInput";
import ScrollArea from "./ScrollArea";
import { MagnifyingGlass } from "@/components/icons";

type MomentDetailsProps = Readonly<{
  initialRes: ReturnType<typeof CoreApi.getMoment>;
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
  const [initialIndex] = useState(imgIndex ? parseInt(imgIndex) : 0);

  useLayoutEffect(() => {
    setCurrentIndex(0);
    if (moment) setMoments([moment]);
  }, [moment, setMoments, setCurrentIndex]);

  if (!moment)
    return (
      <div className={cn("pt-40", "flex flex-col items-center gap-8")}>
        <p className="text-center text-muted-foreground">
          Hmm...this page doesn&apos;t exist. Try searching for something else.
        </p>
        <Link href={ROUTE.SEARCH()}>
          <Button size="default">
            <MagnifyingGlass className="size-4" />
            Search
          </Button>
        </Link>
      </div>
    );
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
      <CommentStorageProvider momentId={moment.id}>
        <CommentInput ref={commentInputRef} />
        <CommentZone />
      </CommentStorageProvider>
    </ScrollArea>
  );
}
