"use client";

import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import zodSchema from "@/lib/zodSchema";
import { useAuth } from "@/components/providers";
import { styles } from "../../../../_constants/styles";

import { InputOTPPattern, ResendText } from "./";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput, SubmitButton } from "../../../../_components";

export default function ChangePasswordForm({ className }: ComponentProps) {
  const { changePassword, sendRecoveryEmail } = useAuth();
  const form = useForm<z.infer<typeof zodSchema.auth.changePassword>>({
    resolver: zodResolver(zodSchema.auth.changePassword),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState(false);
  async function verifyHandler(
    values: z.infer<typeof zodSchema.auth.changePassword>
  ) {
    setLoading(true);
    toast.promise(changePassword(values), {
      loading: "Changing password...",
      success: (res) => {
        setLoading(false);
        if (res.success) return "Password changed successfully!";
        throw new Error(res.message);
      },
      error: (err) => err.message,
    });
  }

  async function resendHandler() {
    setLoading(true);
    toast.promise(sendRecoveryEmail({ email: "text" }), {
      loading: "Sending recovery email...",
      success: (res) => {
        setLoading(false);
        if (res.success) return "Recovery email sent!";
        throw new Error(res.message);
      },
      error: (err) => err.message,
    });
  }

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(verifyHandler)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormDescription className="text-center">
                  Enter the 6-digit code sent to your email
                </FormDescription>
                <FormControl>
                  <InputOTPPattern
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
          <div className={cn(styles.inputGroup, "mt-4")}>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      placeholder="New password"
                      className={styles.input}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm new password"
                      className={styles.input}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton loading={loading} className="mt-8">
            Reset Password
          </SubmitButton>
        </form>
      </Form>

      <div className="mt-4">
        <ResendText onClick={resendHandler} />
      </div>
    </div>
  );
}
