"use client";

import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { toast } from "sonner";

import Tooltip from "@/components/common/Tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import styles from "../../_constants/styles";

import { PasswordInput, SubmitButton } from "../../_components";
import { Circle } from "@/components/icons";

export default function SignupForm() {
  const form = useForm<z.infer<typeof zodSchema.auth.signup>>({
    resolver: zodResolver(zodSchema.auth.signup),
    defaultValues: {
      email: "thgnao@gmail.com",
      username: "Byron",
      password: "T1234567t!",
    },
  });

  const [showDetails, setShowDetails] = useState(false);
  const { signup } = useAuth();
  async function handleSignup(values: z.infer<typeof zodSchema.auth.signup>) {
    const { success, message } = await signup(values);
    if (success)
      toast("🎉 You're almost there!", {
        duration: 12000,
        description:
          "We've sent a verification link to your email. Click it to activate your account and log in.",
      });
    else toast.error(message || "Failed to sign up");
  }

  return (
    <div>
      <Tooltip content="Show details" variant="borderless" sideOffset={6}>
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
                      placeholder="Email"
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
                      placeholder="Username"
                      className={styles.input}
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  {showDetails && (
                    <FormDescription className="text-xs">
                      Only letters, numbers, dots, underscores, and hyphens are
                      allowed and must be at least 2 characters.
                    </FormDescription>
                  )}
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
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  {showDetails && (
                    <FormDescription className="text-xs">
                      Password must be at least 8 characters and include at
                      least three of: uppercase letter (A-Z), lowercase letter
                      (a-z), number (0-9)
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton loading={form.formState.isSubmitting} className="mt-6">
            Sign up
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
}
