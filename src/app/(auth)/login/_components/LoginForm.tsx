"use client";

import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { toast } from "sonner";
import { ROUTE } from "@/constants/clientConfig";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ActionableText, PasswordInput, SubmitButton } from "../../_components";
import { styles } from "../../_constants/styles";

export default function LoginForm() {
  const form = useForm<z.infer<typeof zodSchema.auth.login>>({
    resolver: zodResolver(zodSchema.auth.login),
    defaultValues: {
      identity: "1@gmail.com",
      password: "1",
    },
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  async function loginHandler(values: z.infer<typeof zodSchema.auth.login>) {
    setLoading(true);
    const { success, message } = await login(values);
    if (!success) toast.error(message);
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(loginHandler)}>
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
          <SubmitButton loading={loading}>Login</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
