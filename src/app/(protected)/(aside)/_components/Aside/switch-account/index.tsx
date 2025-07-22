"use client";

import type { AccountInfo } from "api";

import { useState } from "react";
import { useAuth } from "@/components/providers";
import _ from "lodash";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ManagementDialog from "./ManagementDialog";

export default function SwitchAccount() {
  const { user } = useAuth();
  if (!user || _.isEmpty(user)) return null;

  return (
    <div className="w-full px-2">
      <div className="flex items-center justify-between">
        <Content user={user} />
        <SwitchButton />
      </div>
    </div>
  );
}

function Content({ user }: Readonly<{ user: AccountInfo }>) {
  return (
    <div className="flex items-center gap-2">
      <Link href={ROUTE.PROFILE(user.username)}>
        <Avatar
          src={user.avatar}
          alt={`${user.displayName}'s avatar`}
          size="10"
          className="hover:opacity-80 transition-opacity duration-150 ease-in-out"
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
          {user.displayName}
        </Link>
        <Link
          href={ROUTE.PROFILE(user.username)}
          className={cn(
            "text-xs text-muted-foreground",
            "hover:opacity-80 transition-opacity duration-150 ease-in-out"
          )}
        >
          @{user.username}
        </Link>
      </div>
    </div>
  );
}

function SwitchButton() {
  const [open, setOpen] = useState(false);
  function handleClose() {
    setOpen(false);
  }

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
      <ManagementDialog open={open} onClose={handleClose} />
    </Dialog>
  );
}
