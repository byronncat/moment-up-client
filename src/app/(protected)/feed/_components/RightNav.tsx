import type { FeedInfo, FeedNotification } from "api";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { CoreApi } from "@/services";
import { ASPECT_RATIO, ROUTE } from "@/constants/clientConfig";

import { Avatar, Modal } from "@/components";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { FeedView } from "../_components";

type RightNavProps = ComponentProps<{
  data: FeedNotification[] | null;
  loading: boolean;
  onClose: () => void;
}>;

export default function RightNav({ onClose, data, loading }: RightNavProps) {
  return (
    <div
      className={cn(
        "relative",
        "bg-card",
        "w-[20rem] h-full",
        "border-l border-border",
        "box-content shrink-0",
        "flex flex-col overflow-hidden"
      )}
    >
      <div className="absolute top-0 right-0 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      <div className="px-4 pt-7">
        <h2 className="text-2xl font-bold">Stories</h2>
      </div>

      {loading ? (
        <RightNavSkeleton />
      ) : (
        <>
          <div className="px-4 mt-6">
            <h3 className={cn("mb-2", "font-semibold")}>Your story</h3>
            <div className={cn("flex items-center gap-3", "py-2")}>
              <div
                className={cn(
                  "size-14 shrink-0",
                  "bg-accent/[.12] rounded-full",
                  "flex items-center justify-center"
                )}
              >
                <span className="text-3xl">+</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold">Create a story</div>
                <div className="text-sm text-muted-foreground">
                  Add photo or text.
                </div>
              </div>
            </div>
          </div>

          <div className={cn("mt-4 grow", "flex flex-col")}>
            <h3 className={cn("mb-2 px-4", "font-semibold")}>All stories</h3>
            <div
              className={cn(
                "grow",
                "overflow-y-auto scrollbar-hide",
                "max-h-[calc(100vh-14rem)] pb-4"
              )}
            >
              {data?.map((feed, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3",
                    "px-4 py-2",
                    "hover:bg-accent/[.07] cursor-pointer",
                    "transition-colors duration-150 ease-in-out"
                  )}
                >
                  <Avatar
                    src={feed.user.avatar}
                    alt={`${feed.user.displayName}'s avatar`}
                    size="12"
                    ring
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{feed.user.displayName}</div>
                    <div className="text-sm text-muted-foreground">
                      <span>{dayjs(feed.latestFeedTime).fromNow()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function RightNavSkeleton() {
  const FeedItemSkeleton = () => (
    <div className={cn("flex items-center gap-3", "py-2")}>
      <Skeleton className="size-14 rounded-full" />
      <div className="flex-1">
        <Skeleton className="w-24 h-4 my-1" />
        <Skeleton className="w-20 h-3 mt-1.5" />
      </div>
    </div>
  );

  return (
    <>
      <div className="px-4 mt-6">
        <Skeleton className="h-4 w-22 mt-1 mb-3" />
        <FeedItemSkeleton />
      </div>

      <div className="px-4 mt-4">
        <Skeleton className="h-4 w-20 mt-1 mb-3" />
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <FeedItemSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}
