"use client";

import type { StoryInfo } from "api";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth, useStory } from "@/components/providers";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { ApiUrl } from "@/services";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import StoryView from "@/components/story/StoryView";
import RightNav from "./components/RightNav";
import { X } from "@/components/icons";

export default function StoryModal() {
  const { token } = useAuth();
  const params = useParams();
  const username = params.username as string;

  const { setViewingStory } = useStory();
  const { data, isValidating } = useSWRImmutable(
    [ApiUrl.story.getByUsername(username), token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        story: StoryInfo;
      }>(url, token)
  );

  const router = useRouter();
  function handleClose() {
    if (window.history.length > 1) router.back();
    else router.replace(ROUTE.HOME);
  }

  useEffect(() => {
    if (data?.story) setViewingStory(data.story);
  }, [data?.story, setViewingStory]);

  return (
    <Modal className="flex">
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
      <StoryView
        loading={isValidating}
        onClose={handleClose}
        confirm
        className="flex-1"
      />
      <RightNav className="[@media(max-width:1024px)]:hidden" />
    </Modal>
  );
}
