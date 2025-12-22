"use client";

import type { z } from "zod";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { toast } from "sonner";
import { MIN_PASSWORD_LENGTH } from "@/constants/server";

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
  const t = useTranslations("ForgotPasswordPage");

  const recoverPasswordSchema = useMemo(
    () =>
      zodSchema.auth.createRecoverPasswordSchema({
        otpRequired: t("validation.otpRequired"),
        otpLength: t("validation.otpLength"),
        otpInvalidChars: t("validation.otpInvalidChars"),
        newPasswordRequired: t("validation.newPasswordRequired"),
        passwordMinLength: t("validation.passwordMinLength", {
          min: MIN_PASSWORD_LENGTH,
        }),
        passwordComplexity: t("validation.passwordComplexity"),
        confirmPasswordRequired: t("validation.confirmPasswordRequired"),
        passwordsDoNotMatch: t("validation.passwordsDoNotMatch"),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof recoverPasswordSchema>>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { recoverPassword: changePassword, sendOtp } = useAuth();
  async function handleVerify(values: z.infer<typeof recoverPasswordSchema>) {
    const { success, message } = await changePassword(values);
    if (success)
      toast(t("successToastTitle"), {
        duration: 12000,
        description: t("successToastDescription"),
      });
    else toast.error(message || "Failed to change password");
  }

  function handleResend() {
    toast.promise(sendOtp({ identity: defaultValue }), {
      loading: t("resendLoading"),
      success: ({ success, message }) => {
        if (success) return t("resendSuccess");
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
                  {t("otpDescription")}
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
                      placeholder={t("newPasswordInput")}
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
                      placeholder={t("confirmPasswordInput")}
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
            {t("resetPasswordButton")}
          </SubmitButton>
        </form>
      </Form>

      <div className="mt-4">
        <ResendText onClick={handleResend} />
      </div>
    </div>
  );
}
