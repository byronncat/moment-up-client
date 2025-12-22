"use client";

import type { z } from "zod";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "../../_components";
import styles from "../../_constants/styles";

export default function SendOtpForm({
  onSuccess,
}: Readonly<{
  onSuccess: (data: string) => void;
}>) {
  const t = useTranslations("ForgotPasswordPage");

  const sendOtpSchema = useMemo(
    () =>
      zodSchema.auth.createSendOtpSchema({
        identityRequired: t("validation.identityRequired"),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof sendOtpSchema>>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: {
      identity: "",
    },
  });

  const { sendOtp } = useAuth();
  async function handleSendEmail(values: z.infer<typeof sendOtpSchema>) {
    const { success, message } = await sendOtp(values);
    if (success) onSuccess(values.identity);
    else toast.error(message || "Failed to send recovery email");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSendEmail)}>
        <div className={styles.inputGroup}>
          <FormField
            control={form.control}
            name="identity"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <Input
                    placeholder={t("identityInput")}
                    className={styles.input}
                    autoComplete="username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-5">
          <SubmitButton loading={form.formState.isSubmitting}>
            {t("sendEmailButton")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
