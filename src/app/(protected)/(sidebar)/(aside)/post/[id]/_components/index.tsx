"use client";

import type { FeedItemDto } from "api";

import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CommentProvider, useAuth, usePost } from "@/components/providers";
import useSWR from "swr";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { ApiUrl } from "@/services";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentZone, PostButtonGroup, PostHeader } from "@/components/post";
import { ErrorContent } from "@/components/common";
import TextContent from "./TextContent";
import MediaCarousel from "./MediaCarousel";
import CommentInput from "./CommentInput";
import { MagnifyingGlass } from "@/components/icons";

type PostDetailsProps = Readonly<{
  postId: string;
}>;

export default function PostDetails({ postId }: PostDetailsProps) {
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    setPosts,
    getCurrentPost,
    setCurrentPost,
    share,
    report,
    bookmark,
    like,
    follow,
  } = usePost();
  const { user, token } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    [ApiUrl.post.getById(postId), token.accessToken],
    ([url, token]) => SWRFetcherWithToken<{ post: FeedItemDto }>(url, token)
  );

  const post = getCurrentPost();
  const searchParams = useSearchParams();
  const imgIndex = searchParams.get("imgIndex");
  const [initialIndex] = useState(imgIndex ? parseInt(imgIndex) : 0);

  useEffect(() => {
    if (data) {
      setPosts([data.post]);
      setCurrentPost(data.post.id);
    } else {
      setPosts([]);
      setCurrentPost(null);
    }
  }, [data, setPosts, setCurrentPost]);

  if (isLoading) return <PostSkeleton />;
  if (error?.statusCode === 404 || error?.statusCode === 403) {
    if (!user) return notFound();
    return (
      <div className={cn("pt-40 px-4", "flex flex-col items-center gap-4")}>
        <p className="text-center text-muted-foreground">
          Hmm...this page doesn&apos;t exist. Try searching for something else.
        </p>
        <Link href={ROUTE.SEARCH()}>
          <Button variant="outline">
            <MagnifyingGlass className="size-3.5" />
            Search
          </Button>
        </Link>
      </div>
    );
  }
  if (error) return <ErrorContent onRefresh={mutate} className="pt-40" />;

  if (!post) return null;
  return (
    <div className="relative size-full">
      <PostHeader
        data={post}
        actions={{
          follow,
          report,
        }}
      />
      <TextContent data={post.post.text} />
      <MediaCarousel
        files={post.post.files}
        initialIndex={initialIndex}
        className="border-y border-border"
      />
      <PostButtonGroup
        data={post}
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
      <CommentProvider postId={post.id}>
        <CommentInput ref={commentInputRef} />
        <CommentZone />
      </CommentProvider>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex gap-2">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-col gap-1.5 mt-1.5 flex-1">
            <div className="flex items-center gap-1">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-1 h-3" />
              <Skeleton className="w-16 h-3" />
            </div>
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      </div>

      <div className="p-0">
        <div className="px-4 pb-2">
          <Skeleton className="w-4/5 h-4 mb-1" />
        </div>

        <Skeleton className="w-full rounded-none aspect-square border-y border-border" />
      </div>

      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="w-10 h-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="w-10 h-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="w-10 h-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
