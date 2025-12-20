"use client";

import type { z } from "zod";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { toast } from "sonner";
import {
  MAX_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/constants/server";

import Tooltip from "@/components/common/Tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import styles from "../../_constants/styles";

import { PasswordInput, SubmitButton } from "../../_components";
import { Circle } from "@/components/icons";

export default function SignupForm() {
  const t = useTranslations("SignupPage");

  const signupSchema = useMemo(
    () =>
      zodSchema.auth.createSignupSchema({
        emailRequired: t("validation.emailRequired"),
        emailInvalid: t("validation.emailInvalid"),
        usernameRequired: t("validation.usernameRequired"),
        usernameMinLength: t("validation.usernameMinLength", {
          min: MIN_USERNAME_LENGTH,
        }),
        usernameMaxLength: t("validation.usernameMaxLength", {
          max: MAX_NAME_LENGTH,
        }),
        usernameNoStartDot: t("validation.usernameNoStartDot"),
        usernameNoEndDot: t("validation.usernameNoEndDot"),
        usernameNoConsecutiveDots: t("validation.usernameNoConsecutiveDots"),
        usernameInvalidChars: t("validation.usernameInvalidChars"),
        passwordRequired: t("validation.passwordRequired"),
        passwordMinLength: t("validation.passwordMinLength", {
          min: MIN_PASSWORD_LENGTH,
        }),
        passwordComplexity: t("validation.passwordComplexity"),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const [showDetails, setShowDetails] = useState(false);
  const { signup } = useAuth();
  async function handleSignup(values: z.infer<typeof signupSchema>) {
    const { success, message } = await signup(values);
    if (success)
      toast(t("successToastTitle"), {
        duration: 12000,
        description: t("successToastDescription"),
      });
    else toast.error(message || "Failed to sign up");
  }

  return (
    <div>
      <Tooltip
        content={t("showDetailsTooltip")}
        variant="borderless"
        sideOffset={6}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDetails(!showDetails)}
          className="absolute top-1 right-0"
        >
          <Circle
            variant="info"
            className="fill-blue-500 dark:fill-blue-400 size-5"
          />
        </Button>
      </Tooltip>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)}>
          <div className={styles.inputGroup}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input
                      placeholder={t("emailInput")}
                      className={styles.input}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input
                      placeholder={t("usernameInput")}
                      className={styles.input}
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  {showDetails ? (
                    <FormDescription className="text-xs">
                      {t("usernameDescription")}
                    </FormDescription>
                  ) : null}
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
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  {showDetails ? (
                    <FormDescription className="text-xs">
                      {t("passwordDescription")}
                    </FormDescription>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton loading={form.formState.isSubmitting} className="mt-6">
            {t("signupButton")}
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
}
