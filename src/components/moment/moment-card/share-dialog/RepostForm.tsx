import type { UserCardDisplayInfo } from "api";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { CoreApi } from "@/services";
import { Audience } from "@/constants/serverConfig";

import { cn } from "@/libraries/utils";
import Avatar from "../../../common/Avatar";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";
import { Loader } from "@/components/icons";
import AudienceSelector from "./AudienceSelector";
import { useRefreshApi } from "@/components/providers";

interface RepostFormData {
  text: string;
}

type RepostFormProps = Readonly<{
  momentId: string;
  userData: UserCardDisplayInfo;
  onClose: () => void;
}>;

export default function RepostForm({
  momentId,
  userData,
  onClose,
}: RepostFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<Audience>(
    Audience.PUBLIC
  );

  const { control, handleSubmit, reset } = useForm<RepostFormData>({
    defaultValues: {
      text: "",
    },
  });

  const repost = useRefreshApi(CoreApi.repost);
  async function onSubmit(data: RepostFormData) {
    setIsLoading(true);
    const { success, message } = await repost({
      momentId,
      text: data.text,
      audience: selectedAudience,
    });

    if (success) {
      toast.success("Repost successful");
      reset();
      onClose();
    } else toast.error(message);

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="px-6 pb-4 mt-4">
        <div className={cn("flex items-start gap-3", "mb-4")}>
          <Avatar src={userData.avatar} alt={userData.displayName} size="14" />
          <div className={cn("flex flex-col gap-2", "pt-0.5")}>
            <span className="font-semibold leading-tight">
              {userData.displayName}
            </span>
            <AudienceSelector
              selectedAudience={selectedAudience}
              onAudienceChange={setSelectedAudience}
            />
          </div>
        </div>

        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <Textarea
              id="repost"
              className={cn("mb-4 h-24 w-full", "break-all", "resize-none")}
              placeholder="Say something about this content (optional)"
              maxLength={200}
              {...field}
            />
          )}
        />

        <div className="flex justify-end w-full">
          <Button className="w-[100px]" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader className="size-5 animate-spin text-primary-foreground" />
            ) : (
              "Share"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
