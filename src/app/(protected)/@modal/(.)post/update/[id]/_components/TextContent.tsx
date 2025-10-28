import { __parseUrl } from "@/__mocks__";
import type { ContentPrivacy } from "@/constants/server";

import { useState } from "react";
import { useAuth, usePost, useRefreshApi } from "@/components/providers";
import { toast } from "sonner";
import { CoreApi } from "@/services";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import PrivacySelector from "../../../create/_components/text/PrivacySelector";
import Textarea from "../../../create/_components/text/Textarea";
import { Loader2 } from "lucide-react";

type TextContentProps = Readonly<{
  postId: string;
  text: string;
  privacy: ContentPrivacy;
  hasAttachments: boolean;
  setText: (text: string) => void;
  setPrivacy: (privacy: ContentPrivacy) => void;
  onClose: () => void;
}>;

export default function TextContent({
  postId,
  text,
  privacy,
  hasAttachments,
  setText,
  setPrivacy,
  onClose,
}: TextContentProps) {
  "use no memo";
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { updatePost } = usePost();

  const updateApi = useRefreshApi(CoreApi.updatePost);
  async function handleUpdate() {
    if (!hasAttachments && !text) {
      toast.error("Please update the post with text.");
      return;
    }

    setIsLoading(true);

    const { success, message } = await updateApi(postId, {
      text,
      privacy,
    });
    if (success) {
      updatePost(postId, { text, privacy });
      onClose();
    } else toast.error(message);

    setIsLoading(false);
  }

  if (!user) return null;
  return (
    <div
      className={cn(
        "p-3 pb-6",
        "flex flex-col",
        "w-screen h-[calc(100svh-48px)] sm:max-w-lg sm:h-fit"
      )}
    >
      <div className={cn("flex items-center gap-3", "px-2")}>
        <Avatar
          src={__parseUrl(user.avatar, "image", 120, 120)}
          alt={`${user.displayName ?? user.username} avatar`}
          size="12"
        />
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            {user.displayName ?? user.username}
          </span>
          <PrivacySelector privacy={privacy} setPrivacy={setPrivacy} />
        </div>
      </div>

      <Textarea
        text={text}
        setText={setText}
        className="px-2 mt-4 h-full sm:h-[200px]"
      />

      <Button
        onClick={handleUpdate}
        className="mt-0 sm:mt-3 w-24 ml-auto"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Update"}
      </Button>
    </div>
  );
}
