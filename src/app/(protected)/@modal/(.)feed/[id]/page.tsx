"use client";

import type { FeedInfo, FeedNotification } from "api";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CoreApi } from "@/services";
import { ROUTE } from "@/constants/route";

import { Modal } from "@/components/common";
import { FeedView, RightNav } from "@/app/(protected)/feed/_components";

export default function FeedModal() {
  const router = useRouter();
  const params = useParams();
  const feedId = params.id as string;
  const [currentFeed, setCurrentFeed] = useState<FeedInfo | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [totalFeeds, setTotalFeeds] = useState<FeedNotification[] | null>(null);
  const [totalLoading, setTotalLoading] = useState(true);

  function closeHandler() {
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
      const res = await CoreApi.getFeeds();
      if (res.success) setTotalFeeds(res.data ?? null);
      setTotalLoading(false);
    }
    fetchFeed();
    fetchTotalFeeds();
  }, [feedId]);

  return (
    <Modal>
      <FeedView
        data={currentFeed}
        loading={detailLoading}
        onClose={closeHandler}
      />
      <RightNav
        data={totalFeeds}
        loading={totalLoading}
        onClose={closeHandler}
      />
    </Modal>
  );
}
