"use client";

import type { z } from "zod";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAuth } from "@/components/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { toast } from "sonner";
import { ROUTE, SocialAuthError } from "@/constants/route";

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
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const errorParam = searchParams.get("error") as keyof typeof SocialAuthError;

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

  const form = useForm<z.infer<typeof zodSchema.auth.login>>({
    resolver: zodResolver(zodSchema.auth.login),
    defaultValues: {
      identity: emailParam ?? "ByronAT445@gmail.com",
      password: "1",
    },
  });

  const { login } = useAuth();
  async function handleLogin(values: z.infer<typeof zodSchema.auth.login>) {
    const { success, message } = await login(values);
    if (!success) {
      if (
        message.includes("Email not verified") ||
        message.includes("verification email has been sent")
      )
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
                    placeholder="Pasword"
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
            highlightedText="Forgot your password?"
            className="text-right mb-2"
          />
          <SubmitButton loading={form.formState.isSubmitting}>
            Login
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
