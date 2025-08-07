"use client";

import type { FeedInfo, FeedNotificationInfo } from "api";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CoreApi } from "@/services";
import { ROUTE } from "@/constants/route";

import { Modal } from "@/components/common";
import { FeedView, RightNav } from "../../_components";

export default function FeedModal() {
  const router = useRouter();
  const params = useParams();
  const feedId = params.id as string;
  const [currentFeed, setCurrentFeed] = useState<FeedInfo | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [totalFeeds] = useState<FeedNotificationInfo[] | null>(null);
  const [totalLoading, setTotalLoading] = useState(true);

  function handleClose() {
    if (window.history.length > 1) router.back();
    else router.replace(ROUTE.HOME);
  }

  useEffect(() => {
    async function fetchFeed() {
      const res = await CoreApi.getFeed(feedId);
      if (res.success) setCurrentFeed(res.data ?? null);
      setDetailLoading(false);
    }
    async function fetchTotalFeeds() {
      // const res = await CoreApi.getFeeds();
      // if (res.success) setTotalFeeds(res.data ?? null);
      setTotalLoading(false);
    }
    fetchFeed();
    fetchTotalFeeds();
  }, [feedId]);

  return (
    <Modal>
      <FeedView
        data={currentFeed ?? undefined}
        initialIndex={0}
        loading={detailLoading}
        onClose={handleClose}
      />
      {/* <RightNav
        data={totalFeeds ?? []}
        loading={totalLoading}
        onClose={handleClose}
      /> */}
    </Modal>
  );
}
