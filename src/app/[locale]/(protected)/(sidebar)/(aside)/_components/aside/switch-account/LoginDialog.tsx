import type { z } from "zod";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { SERVER_HOST_URL } from "@/constants/server";

import { cn } from "@/libraries/utils";
import { Tooltip } from "@/components/common";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/app/[locale]/(auth)/_components";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "@/components/icons";
import styles from "@/app/[locale]/(auth)/_constants/styles";

type LoginDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginDialog({
  open,
  onClose,
}: Readonly<LoginDialogProps>) {
  const router = useRouter();
  const { addAccount, reload, setLoaded } = useAuth();
  const form = useForm<z.infer<typeof zodSchema.auth.login>>({
    resolver: zodResolver(zodSchema.auth.login),
    defaultValues: {
      identity: "",
      password: "",
    },
  });

  async function handleLogin(values: z.infer<typeof zodSchema.auth.login>) {
    const { success, message } = await addAccount(values);
    if (success) reload();
    else toast.error(message || "Failed to add account");
  }

  function handleGoogleLogin() {
    setLoaded(false);
    sessionStorage.setItem("google_switch_account", "true");
    router.push(`${SERVER_HOST_URL}/v1/auth/google`);
  }

  useEffect(() => {
    if (!open) form.reset();
  }, [open, form]);

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
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <div className={cn(styles.inputGroup, "mb-8")}>
              <FormField
                control={form.control}
                name="identity"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input
                        placeholder="Username or Email"
                        className={styles.input}
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
                        className={styles.input}
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between items-center">
              <Tooltip content="Sign in with Google" sideOffset={6}>
                <Button size="icon" variant="ghost" onClick={handleGoogleLogin}>
                  <GoogleIcon className="size-5 fill-muted-foreground" />
                </Button>
              </Tooltip>
              <div className="flex gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button className="w-24" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <Loader className="animate-spin text-primary-foreground size-5" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function GoogleIcon({ className }: Readonly<{ className: string }>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
    </svg>
  );
}
