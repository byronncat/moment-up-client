import { useAuth } from "@/components/providers";
import { usePostData } from "../../_provider/PostData";
import { toast } from "sonner";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import PrivacySelector from "./PrivacySelector";
import Textarea from "./Textarea";
import ControlButtons from "./ControlButtons";

export default function TextContent() {
  const { user } = useAuth();
  const { privacy, text, hasContent, setPrivacy, setPhase, setText } =
    usePostData();

  function handlePreview() {
    if (!hasContent) {
      toast.error("Please enter some text or upload media.");
      return;
    }
    setPhase("preview");
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
          src={user.avatar}
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

      <div
        className={cn(
          "mt-3 sm:mt-1.5",
          "flex justify-between items-center sm:items-start"
        )}
      >
        <ControlButtons />
        <Button onClick={handlePreview} className="mt-0 sm:mt-3">
          Preview
        </Button>
      </div>
    </div>
  );
}
