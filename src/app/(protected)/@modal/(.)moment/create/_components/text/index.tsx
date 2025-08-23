import { useAuth } from "@/components/providers";
import { useMomentData } from "../../_provider/MomentData";
import { toast } from "sonner";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import PrivacySelector from "./PrivacySelector";
import Textarea from "./Textarea";
import ControlButtons from "./ControlButtons";

export default function TextContent() {
  const { user } = useAuth();
  const { hasContent, setPhase } = useMomentData();

  function handlePreview() {
    if (!hasContent) {
      toast.error("Please enter some text or upload media");
      return;
    }
    setPhase("preview");
  }

  return (
    <div
      className={cn(
        "relative bg-background",
        "w-[640px] max-w-full h-fit",
        "p-3 pb-8"
      )}
    >
      <div className={cn("flex items-center gap-3", "px-2")}>
        <Avatar src={user?.avatar} alt={user?.displayName} size="12" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{user?.displayName}</span>
          <PrivacySelector />
        </div>
      </div>

      <Textarea className="px-2 mt-4 h-[200px]" />

      <ControlButtons className="mt-1.5" />

      <Button
        type="button"
        className="absolute bottom-4 right-3"
        onClick={handlePreview}
      >
        Preview
      </Button>
    </div>
  );
}
