"use client";

import type { API, DetailedMomentInfo } from "api";
import { use, useEffect, useState, useRef } from "react";
import { useMoment } from "@/components/providers";
import { CoreApi } from "@/services";

import { ErrorContent, NoContent } from "@/components";
import Grid from "./Grid";
import { Images } from "lucide-react";

type MediaGridProps = Readonly<{
  initialRes: Promise<
    API<{
      items: DetailedMomentInfo[];
      hasNextPage: boolean;
    }>
  >;
}>;

export default function Media({ initialRes }: MediaGridProps) {
  const response = use(initialRes);
  const {
    moments: media,
    setMoments: setMedia,
    setCurrentIndex,
    addMoments,
  } = useMoment();
  const [hasNextPage, setHasNextPage] = useState(
    response?.data?.hasNextPage ?? true
  );
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const pageRef = useRef(1);
  const resetFnRef = useRef<(() => void) | null>(null);

  async function fetchMedia(page?: number) {
    const response = await CoreApi.explore(
      "media",
      page ?? pageRef.current + 1
    );
    if (response.success) {
      addMoments(response.data?.items ?? []);
      setHasNextPage(response.data?.hasNextPage ?? false);
      pageRef.current = pageRef.current + 1;
    } else setHasNextPage(false);
    setIsNextPageLoading(false);
  }

  useEffect(() => {
    if (response.data) setMedia(response.data.items);
  }, [response.success, response.data, setMedia]);

  if (!response.success) return <ErrorContent onRefresh={() => {}} />;
  if (!media) return null;
  if (media.length === 0)
    return (
      <NoContent
        icon={<Images className="size-16 text-muted-foreground" />}
        title="No media found"
        description="Wait for someone to post a media."
      />
    );

  return (
    <Grid
      items={media}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={() => fetchMedia()}
      onItemClick={setCurrentIndex}
      actions={{
        resetList: (resetFn) => {
          resetFnRef.current = resetFn;
        },
      }}
    />
  );
}
