import type { z } from "zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";

import { cn } from "@/libraries/utils";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/app/(auth)/_components";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import styles from "@/app/(auth)/_constants/styles";

type LoginDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginDialog({
  open,
  onClose,
}: Readonly<LoginDialogProps>) {
  const form = useForm<z.infer<typeof zodSchema.auth.login>>({
    resolver: zodResolver(zodSchema.auth.login),
    defaultValues: {
      identity: "",
      password: "",
    },
  });

  const { user, addAccount, reload } = useAuth();
  async function handleLogin(values: z.infer<typeof zodSchema.auth.login>) {
    if (values.identity === user?.username || values.identity === user?.email) {
      toast.error("You cannot add yourself");
      return;
    }

    const { success, message } = await addAccount(values);
    if (success) reload();
    else toast.error(message);
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
            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-24"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin text-primary-foreground size-5" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
