"use client";

import type { StoryInfo } from "api";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers";
import useSWRImmutable from "swr/immutable";
import { SWRFetcherWithToken } from "@/libraries/swr";
import { ApiUrl } from "@/services";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import { Modal } from "@/components/common";
import { Button } from "@/components/ui/button";
import StoryView from "./_components/StoryView";
import { X } from "@/components/icons";

export default function StoryModal() {
  const router = useRouter();
  const params = useParams();
  const storyId = params.id as string;
  const username = params.username as string;

  const { token } = useAuth();
  const { data, isLoading } = useSWRImmutable(
    [ApiUrl.story.getByUsername(username), token.accessToken],
    ([url, token]) =>
      SWRFetcherWithToken<{
        story: StoryInfo;
      }>(url, token)
  );

  function handleClose() {
    if (window.history.length > 1) router.back();
    else router.replace(ROUTE.HOME);
  }

  const initialIndex =
    data?.story.stories.findIndex((story) => story.id === storyId) || 0;

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
      <StoryView
        data={data?.story}
        loading={isLoading}
        initialIndex={initialIndex}
        onClose={handleClose}
        className="size-full"
      />
    </Modal>
  );
}
