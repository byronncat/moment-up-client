"use client";

import type { z } from "zod";
import type { API } from "api";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import zodSchema from "@/lib/zodSchema";
import { useAuth } from "@/components/providers";
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

export default function LoginForm() {
  const { login } = useAuth();
  const form = useForm<z.infer<typeof zodSchema.login>>({
    resolver: zodResolver(zodSchema.login),
    defaultValues: {
      identity: "Byron",
      password: "12345678",
    },
  });

  const [loading, setLoading] = useState(false);
  async function loginHandler(values: z.infer<typeof zodSchema.login>) {
    setLoading(true);
    toast.promise(login(values), {
      loading: "Logging in...",
      success: (res: API) => {
        setLoading(false);
        if (res.success) {
          return "Login successful!";
        } else throw new Error(res.message);
      },
      error: (error) => error.message,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(loginHandler)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="identity"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <Input
                    placeholder="Username or Email"
                    className="h-10 bg-card"
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
                    className="h-10 bg-card"
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
