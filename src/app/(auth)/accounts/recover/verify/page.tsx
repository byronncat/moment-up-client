"use client";

import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { verifyRecoverySchema } from "@/lib/zodSchema";
import { useAuth } from "@/components/providers";
import { ROUTE } from "@/constants/serverConfig";
import { sourceCodePro } from "@/styles/fonts";
import { ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  NavigationText,
  PageTitle,
  PasswordInput,
  SubmitButton,
} from "../../../_components";
import Link from "next/link";

export default function VerifyRecoveryPage() {
  const form = useForm<z.infer<typeof verifyRecoverySchema>>({
    resolver: zodResolver(verifyRecoverySchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState(false);
  async function onVerify(values: z.infer<typeof verifyRecoverySchema>) {
    setLoading(true);
    // TODO: Implement verification and password reset
    console.log(values);
    setLoading(false);
  }

  return (
    <div className={cn("w-96 rounded-lg", "px-5 pt-6 pb-5")}>
      <PageTitle title="Enter verification code" variant="secondary" />
      <p className={cn("text-sm text-muted-foreground text-center", "mb-6")}>
        Enter the 6-digit code sent to your email
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onVerify)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter verification code"
                    className={cn(
                      "h-12 bg-card/50",
                      "text-center tracking-[0.5em]",
                      sourceCodePro.className,
                      "text-lg font-medium uppercase",
                      "placeholder:text-muted-foreground/50",
                      "placeholder:tracking-normal",
                      "placeholder:text-base"
                    )}
                    maxLength={6}
                    onKeyDown={(e) => {
                      // Allow: backspace, delete, tab, escape, enter
                      if (
                        [
                          "Backspace",
                          "Delete",
                          "Tab",
                          "Escape",
                          "Enter",
                          "ArrowLeft",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowDown",
                        ].includes(e.key)
                      ) {
                        return;
                      }

                      // Block if not a number or letter
                      if (!/^[a-zA-Z0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                      onChange(value.slice(0, 6));
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      placeholder="New password"
                      className="h-10 bg-card"
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
                      className="h-10 bg-card"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton loading={loading}>Reset Password</SubmitButton>
        </form>
      </Form>

      <div className="mt-4">
        <NavigationText
          text="Didn't receive the code?"
          path={ROUTE.FORGOT_PASSWORD}
          hyperlink="Resend"
          className={cn("w-full", "text-center")}
        />
      </div>

      <Link
        href={ROUTE.LOGIN}
        className={cn(
          "inline-flex items-center gap-2",
          "text-sm text-muted-foreground",
          "mt-6 float-right",
          "hover:text-foreground transition-colors"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>
    </div>
  );
}
