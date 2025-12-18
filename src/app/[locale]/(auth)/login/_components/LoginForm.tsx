"use client";

import type { z } from "zod";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { toast } from "sonner";
import { ROUTE, SocialAuthError } from "@/constants/route";
import { ErrorCode } from "@/constants/server";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ActionableText, PasswordInput, SubmitButton } from "../../_components";
import styles from "../../_constants/styles";

export default function LoginForm() {
  const t = useTranslations("LoginPage");
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const errorParam = searchParams.get("error") as keyof typeof SocialAuthError;

  const loginSchema = useMemo(
    () =>
      zodSchema.auth.createLoginSchema({
        identityRequired: t("validation.identityRequired"),
        passwordRequired: t("validation.passwordRequired"),
      }),
    [t]
  );

  useEffect(() => {
    if (errorParam) {
      if (errorParam === SocialAuthError.AccountBlocked.code)
        toast.error(SocialAuthError.AccountBlocked.title, {
          description: SocialAuthError.AccountBlocked.description,
        });
      else
        toast.error(SocialAuthError.Default.title, {
          description: SocialAuthError.Default.description,
        });

      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [errorParam]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identity: emailParam ?? "",
      password: "",
    },
  });

  const { login } = useAuth();
  async function handleLogin(values: z.infer<typeof loginSchema>) {
    const { success, message, code } = await login(values);
    if (!success) {
      if (code === ErrorCode.EMAIL_NOT_VERIFIED)
        toast("🎉 You're almost there!", {
          duration: 12000,
          description:
            "We've sent a verification link to your email. Click it to activate your account and log in.",
        });
      else toast.error(message || "Failed to login");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)}>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    placeholder={t("passwordInput")}
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

        <div className="mt-5">
          <ActionableText
            path={ROUTE.FORGOT_PASSWORD}
            highlightedText={t("forgotPasswordLink")}
            className="text-right mb-2"
          />
          <SubmitButton loading={form.formState.isSubmitting}>
            {t("loginButton")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
