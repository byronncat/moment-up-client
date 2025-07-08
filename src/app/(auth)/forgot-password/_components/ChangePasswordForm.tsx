"use client";

import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { toast } from "sonner";

import { cn } from "@/libraries/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput, SubmitButton } from "../../_components";
import InputOTPPattern from "./InputOTPPattern";
import ResendText from "./ResendText";
import styles from "../../_constants/styles";

type ChangePasswordFormProps = Readonly<{
  defaultValue: string;
  className?: string;
}>;

export default function ChangePasswordForm({
  defaultValue,
  className,
}: ChangePasswordFormProps) {
  const form = useForm<z.infer<typeof zodSchema.auth.changePassword>>({
    resolver: zodResolver(zodSchema.auth.changePassword),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { changePassword, sendOtpEmail } = useAuth();
  async function verifyHandler(
    values: z.infer<typeof zodSchema.auth.changePassword>
  ) {
    setLoading(true);
    const { success, message } = await changePassword(values);
    if (success)
      toast("🎉 Password changed successfully!", {
        duration: 12000,
        description: "You can now log in with your new password.",
      });
    else toast.error(message);
    setLoading(false);
  }

  async function resendHandler() {
    setLoading(true);
    toast.promise(sendOtpEmail({ identity: defaultValue }), {
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
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormDescription className="text-center">
                  Enter the OTP sent to your email
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
