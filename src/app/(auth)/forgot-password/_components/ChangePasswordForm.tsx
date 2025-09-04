"use client";

import type { z } from "zod";

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
  const form = useForm<z.infer<typeof zodSchema.auth.recoverPassword>>({
    resolver: zodResolver(zodSchema.auth.recoverPassword),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { recoverPassword: changePassword, sendOtpEmail } = useAuth();
  async function handleVerify(
    values: z.infer<typeof zodSchema.auth.recoverPassword>
  ) {
    const { success, message } = await changePassword(values);
    if (success)
      toast("🎉 Password changed successfully!", {
        duration: 12000,
        description: "You can now log in with your new password.",
      });
    else toast.error(message || "Failed to change password");
  }

  function handleResend() {
    toast.promise(sendOtpEmail({ identity: defaultValue }), {
      loading: "Sending recovery email...",
      success: ({ success, message }) => {
        if (success) return "Recovery email sent!";
        throw new Error(message);
      },
      error: ({ message }) => message,
    });
  }

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleVerify)}>
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

          <SubmitButton loading={form.formState.isSubmitting} className="mt-8">
            Reset Password
          </SubmitButton>
        </form>
      </Form>

      <div className="mt-4">
        <ResendText onClick={handleResend} />
      </div>
    </div>
  );
}
