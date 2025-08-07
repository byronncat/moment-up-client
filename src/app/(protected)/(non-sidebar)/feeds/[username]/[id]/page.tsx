"use client";

import type { FeedInfo } from "api";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { ApiUrl } from "@/services";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import FeedView from "./_components/FeedView";
import { X } from "@/components/icons";

export default function FeedModal() {
  const router = useRouter();
  const params = useParams();
  const feedId = params.id as string;
  const username = params.username as string;

  const { token } = useAuth();
  const { data, isLoading } = useSWRImmutable(
    [ApiUrl.feed.getByUsername(username), token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        feed: FeedInfo;
      }>(url, token)
  );

  function handleClose() {
    if (window.history.length > 1) router.back();
    else router.replace(ROUTE.HOME);
  }

  const initialIndex =
    data?.feed.feeds.findIndex((feed) => feed.id === feedId) || 0;

  return (
    <Modal>
      <Button
        onClick={handleClose}
        size="icon"
        variant="ghost"
        className={cn(
          "absolute top-2 left-2",
          "rounded-full",
          "hover:bg-accent-dark/[.2]",
          "text-muted-foreground-dark hover:text-accent-foreground-dark"
        )}
      >
        <X className="size-6" />
      </Button>
      <FeedView
        data={data?.feed}
        loading={isLoading}
        initialIndex={initialIndex}
        onClose={handleClose}
        className="size-full"
      />
    </Modal>
  );
}
