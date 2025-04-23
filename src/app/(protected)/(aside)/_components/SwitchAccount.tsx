"use client";

import type { AccountInfo } from "api";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers";
import { ROUTE } from "@/constants/clientConfig";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/components/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthApi } from "@/services";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SwitchAccount() {
  const { user } = useAuth();

  if (!user) return null;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <Content user={user} />
        <SwitchButton />
      </div>
    </div>
  );
}

type ContentProps = ComponentProps<{
  user: AccountInfo;
}>;

function Content({ user }: ContentProps) {
  return (
    <div className="flex items-center gap-2">
      <Link href={ROUTE.PROFILE(user.username)}>
        <Avatar className="size-10">
          <AvatarImage
            src={user?.avatar}
            alt="Your profile picture"
            className="object-cover"
          />
          <AvatarFallback className="bg-primary">
            <User className="size-6 fill-card" type="solid" />
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex flex-col">
        <Link
          href={ROUTE.PROFILE(user.username)}
          className={cn(
            "text-sm font-semibold",
            "hover:opacity-60",
            "transition-opacity duration-150 ease-in-out"
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "text-xs font-semibold text-primary",
            "cursor-pointer hover:text-primary/80",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          Switch
        </button>
      </DialogTrigger>
      <ManagementModal />
    </Dialog>
  );
}

function ManagementModal() {
  const { user, switchAccount } = useAuth();
  const [accounts, setAccounts] = useState<AccountInfo[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function switchAccountHandler(accountId: AccountInfo["id"]) {
    if (user?.id === accountId) return;
    setLoading(true);
    toast.loading("Switching account...");
    const { success } = await switchAccount(accountId);
    setLoading(false);
    if (!success) toast.error("Failed to switch account");
  }

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await AuthApi.getAllAcounts();
      if (res.success && res.data) setAccounts(res.data);
      setLoading(false);
    };
    fetchAccounts();
  }, []);

  return (
    <DialogContent className="sm:max-w-md p-0 pb-4">
      <DialogHeader className={cn("text-lg", "px-6 pt-6 pb-3")}>
        <DialogTitle>
          Manage Accounts {accounts && `(${accounts.length}}`}
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col">
        {loading ? (
          <SkeletonAccount />
        ) : (
          accounts?.map((account) => (
            <div
              key={account.id}
              className={cn(
                "px-6 py-3",
                "flex items-center gap-2",
                "hover:bg-accent/[.07] cursor-pointer",
                "transition-colors duration-150 ease-in-out"
              )}
            >
              <Avatar className="size-12">
                <AvatarImage
                  src={account.avatar}
                  alt="Your profile picture"
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary">
                  <User className="size-8 fill-card" type="solid" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
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
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Add an account"
            )}
          </Button>
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
