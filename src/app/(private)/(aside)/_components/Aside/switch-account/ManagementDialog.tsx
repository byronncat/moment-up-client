import type { AccountInfo } from "api";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers";
import { indexedDBService } from "@/services";
import { toast } from "sonner";

import { cn } from "@/libraries/utils";
import { Avatar } from "@/components/common";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LoginDialog from "./LoginDialog";

export default function ManagementDialog({
  open,
  onClose,
}: Readonly<{
  open: boolean;
  onClose: () => void;
}>) {
  const [accounts, setAccounts] = useState<AccountInfo[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    if (!open) return;
    async function fetchAccounts() {
      setLoading(true);
      const data = await indexedDBService.getAllAccounts();
      if (data) setAccounts(data);
      else {
        onClose();
        toast.error("Failed to fetch accounts");
      }
      setLoading(false);
    }
    fetchAccounts();
  }, [open, onClose]);

  return (
    <>
      <DialogContent
        className={cn("sm:max-w-md p-0 pb-4", showLoginDialog && "hidden")}
      >
        <DialogHeader className={cn("text-lg", "px-6 pt-6")}>
          <DialogTitle>Manage Accounts</DialogTitle>
          <DialogDescription>
            Select an account to switch to or add a new account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          {loading ? (
            <SkeletonAccount />
          ) : (
            accounts?.map((account) => (
              <AccountItem key={account.id} account={account} />
            ))
          )}
          <div
            className={cn("self-end mt-6 pr-4", "flex justify-center gap-3")}
          >
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button disabled={loading} onClick={() => setShowLoginDialog(true)}>
              Add an account
            </Button>
          </div>
        </div>
      </DialogContent>
      <LoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </>
  );
}

function AccountItem({ account }: Readonly<{ account: AccountInfo }>) {
  const { user, switchAccount, reload } = useAuth();
  const isMe = user?.id === account.id;

  async function handleSwitch(accountId: AccountInfo["id"]) {
    const { success, message } = await switchAccount(accountId);
    if (success) reload();
    else toast.error(message || "Failed to switch account");
  }

  return (
    <div
      key={account.id}
      onClick={() => handleSwitch(account.id)}
      role="button"
      tabIndex={!isMe ? 0 : -1}
      aria-disabled={isMe}
      className={cn(
        "px-6 py-3",
        "flex items-center gap-2",
        !isMe && "cursor-pointer",
        "hover:bg-accent/[.07] transition-colors duration-150 ease-in-out",
        "focus:bg-accent/[.07] focus:outline-none focus:ring-2 focus:ring-primary/20"
      )}
    >
      <Avatar
        src={account.avatar}
        alt={`${account.displayName}'s profile picture`}
        size="12"
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{account.displayName}</span>
          {isMe && (
            <span
              className={cn(
                "inline-block size-2 rounded-full",
                "bg-green-600 dark:bg-green-400"
              )}
              aria-label="Current account"
            />
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          @{account.username}
        </span>
      </div>
    </div>
  );
}

function SkeletonAccount() {
  return (
    <div className="px-6 py-3">
      <div className="flex items-center gap-2">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
    </div>
  );
}
