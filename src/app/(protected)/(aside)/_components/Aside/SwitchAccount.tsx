"use client";

import type { UserAccountInfo } from "api";
import type { z } from "zod";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { AuthApi } from "@/services";
import { ROUTE } from "@/constants/clientConfig";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Avatar } from "@/components/common";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/app/(auth)/_components";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

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
  user: UserAccountInfo;
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
      <ManagementModal open={open} onClose={() => setOpen(false)} />
    </Dialog>
  );
}

function ManagementModal({
  open,
  onClose,
}: Readonly<{
  open: boolean;
  onClose: () => void;
}>) {
  const { user, changeAccount } = useAuth();
  const [accounts, setAccounts] = useState<UserAccountInfo[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  async function switchAccount(accountId: UserAccountInfo["id"]) {
    if (user?.id === accountId || loading) return;
    await changeAccount(accountId);
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    async function fetchAccounts() {
      setLoading(true);
      const res = await AuthApi.getAllAcounts();
      if (res.success) setAccounts(res.data ?? []);
      else {
        onClose();
        toast.error("Something went wrong! Please try again later.");
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
              <div
                key={account.id}
                onClick={() => switchAccount(account.id)}
                className={cn(
                  "px-6 py-3",
                  "flex items-center gap-2",
                  user?.id !== account.id && "cursor-pointer",
                  "hover:bg-accent/[.07] transition-colors duration-150 ease-in-out"
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
        onClose={() => {
          setShowLoginDialog(false);
        }}
        onSuccess={() => {
          onClose();
        }}
      />
    </>
  );
}

function LoginDialog({
  open,
  onClose,
  onSuccess,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}>) {
  const form = useForm<z.infer<typeof zodSchema.auth.login>>({
    resolver: zodResolver(zodSchema.auth.login),
    defaultValues: {
      identity: "",
      password: "",
    },
  });

  const { switchLogin } = useAuth();

  async function loginHandler(values: z.infer<typeof zodSchema.auth.login>) {
    const res = await switchLogin(values);
    if (res.success) {
      onClose();
      onSuccess();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-2">
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription>
            Enter your credentials to add another account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(loginHandler)}>
            <div className={cn("space-y-2", "mb-8")}>
              <FormField
                control={form.control}
                name="identity"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input
                        placeholder="Username or Email"
                        className="h-10"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        placeholder="Password"
                        className="h-10"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="w-24">
                Login
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
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
