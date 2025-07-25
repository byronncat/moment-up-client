import type { UserCardDisplayInfo } from "api";

import { cn } from "@/libraries/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import RepostForm from "./RepostForm";

type ShareDialogProps = Readonly<{
  momentId: string;
  userData: UserCardDisplayInfo;
  open: boolean;
  onClose: () => void;
}>;

export default function ShareDialog({
  momentId,
  userData,
  open,
  onClose,
}: ShareDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md">
        <DialogHeader className={cn("border-b", "py-3")}>
          <DialogTitle className="text-center text-lg font-semibold">
            Repost
          </DialogTitle>
          <DialogDescription
            className={cn(
              "text-center text-sm text-muted-foreground",
              "hidden"
            )}
          >
            Share this moment with your friends
          </DialogDescription>
        </DialogHeader>
        <RepostForm momentId={momentId} userData={userData} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
