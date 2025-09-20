"use client";

import { __parseUrl } from "@/__mocks__";
import type { AccountDto } from "api";

import { useState } from "react";
import { useAuth } from "@/components/providers";
import _ from "lodash";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ManagementDialog from "./ManagementDialog";

export default function SwitchAccount() {
  const { user } = useAuth();
  if (!user || _.isEmpty(user)) return null;

  return (
    <div className={cn("w-full px-2", "flex items-center justify-between")}>
      <Content user={user} className="min-w-0 mr-3" />
      <SwitchButton />
    </div>
  );
}

function Content({
  user,
  className,
}: Readonly<{ user: AccountDto; className?: string }>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href={ROUTE.PROFILE(user.username)}
        className="focus-indicator rounded-full"
      >
        <Avatar
          src={__parseUrl(user.avatar, "image", 40, 40)}
          alt={`${user.displayName ?? user.username}'s avatar`}
          size="10"
          className="hover:opacity-80 transition-opacity duration-150 ease-in-out"
        />
      </Link>
      <div className="flex flex-col min-w-0">
        <Link
          href={ROUTE.PROFILE(user.username)}
          className={cn(
            "text-sm font-semibold",
            "hover:opacity-80 transition-opacity duration-150 ease-in-out",
            "truncate",
            "focus-indicator rounded-sm"
          )}
        >
          {user.displayName ?? user.username}
        </Link>
        <Link
          href={ROUTE.PROFILE(user.username)}
          className={cn(
            "text-sm text-muted-foreground",
            "hover:opacity-80 transition-opacity duration-150 ease-in-out",
            "truncate",
            "focus-indicator rounded-sm"
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
        <Button size="sm" variant="outline" className="text-xs cursor-pointer">
          Switch
        </Button>
      </DialogTrigger>
      <ManagementDialog open={open} onClose={handleClose} />
    </Dialog>
  );
}
