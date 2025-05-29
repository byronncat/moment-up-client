"use client";

import type { AccountInfo } from "api";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { AuthApi } from "@/services";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SwitchAccountt() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="w-full px-2">
      <div className="flex items-center justify-between">
        <Content user={user} />
        <SwitchButton />
      </div>
    </div>
  );
}

function Content({
  user,
}: Readonly<{
  user: AccountInfo;
}>) {
  return (
    <div className="flex items-center gap-2">
      <Link href={ROUTE.PROFILE(user.username)}>
        <Avatar
          src={user.avatar}
          alt={`${user?.displayName}'s avatar`}
          size="10"
          className={cn(
            "hover:opacity-80",
            "transition-opacity duration-150 ease-in-out"
          )}
        />
      </Link>
      <div className="flex flex-col">
        <Link
          href={ROUTE.PROFILE(user.username)}
          className={cn(
            "text-sm font-semibold",
            "hover:opacity-80 transition-opacity duration-150 ease-in-out"
          )}
        >
          {user?.displayName}
        </Link>
        <span className="text-sm text-muted-foreground">@{user?.username}</span>
      </div>
    </div>
  );
}

function SwitchButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "text-xs font-semibold text-primary",
            "cursor-pointer hover:opacity-80",
            "transition-opacity duration-150 ease-in-out"
          )}
        >
          Switch
        </button>
      </DialogTrigger>
      <ManagementModal onClose={() => setOpen(false)} />
    </Dialog>
  );
}

function ManagementModal({
  onClose,
}: Readonly<{
  onClose: () => void;
}>) {
  const { user, changeAccount } = useAuth();
  const [accounts, setAccounts] = useState<AccountInfo[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function switchAccount(accountId: AccountInfo["id"]) {
    if (user?.id === accountId || loading) return;
    setLoading(true);

    toast.promise(changeAccount(accountId), {
      loading: "Switching account...",
      success: (res) => {
        setLoading(false);
        if (res.success) {
          onClose();
          return "Account switched successfully";
        }
        throw new Error(res.message);
      },
      error: "Failed to switch account",
    });
  }

  useEffect(() => {
    async function fetchAccounts() {
      const res = await AuthApi.getAllAcounts();
      if (res.success) setAccounts(res.data ?? []);
      setLoading(false);
    }
    fetchAccounts();
  }, []);

  return (
    <DialogContent className="sm:max-w-md p-0 pb-4">
      <DialogHeader className={cn("text-lg", "px-6 pt-6")}>
        <DialogTitle>Manage Accounts</DialogTitle>
        <DialogDescription>
          Select an account to switch to or add a new account.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col">
        {loading && !accounts ? (
          <SkeletonAccount />
        ) : (
          accounts?.map((account) => (
            <div
              key={account.id}
              onClick={() => switchAccount(account.id)}
              className={cn(
                "px-6 py-3",
                "flex items-center gap-2",
                !loading && "hover:bg-accent/[.07]",
                user?.id !== account.id && "cursor-pointer",
                "transition-colors duration-150 ease-in-out"
              )}
            >
              <Avatar
                src={account.avatar}
                alt="Your profile picture"
                size="12"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{account.displayName}</span>
                  {user?.id === account.id && (
                    <span
                      className={cn(
                        "inline-block size-2 rounded-full",
                        "bg-green-600 dark:bg-green-400"
                      )}
                    />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  @{account.username}
                </span>
              </div>
            </div>
          ))
        )}
        <div className={cn("self-end mt-6 pr-4", "flex justify-center gap-3")}>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Close
            </Button>
          </DialogClose>
          <Button disabled={loading}>Add an account</Button>
        </div>
      </div>
    </DialogContent>
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
