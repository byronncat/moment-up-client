"use client";

import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { loginFormSchema } from "@/lib/zodSchema";
import { useAuth } from "@/components/providers";
import { ROUTE } from "@/constants/serverConfig";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  GoogleButton,
  NavigationText,
  PageTitle,
  PasswordInput,
  SubmitButton,
} from "../_components";
import { Divider } from "@/components";

export default function LoginPage() {
  const { login } = useAuth();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identity: "Byron",
      password: "12345678",
    },
  });

  const [loading, setLoading] = useState(false);
  async function onLogin(values: z.infer<typeof loginFormSchema>) {
    setLoading(true);
    await login(values);
    setLoading(false);
  }

  return (
    <div className={cn("w-96 rounded-lg", "px-5 pt-6 pb-5")}>
      <PageTitle title="Login" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onLogin)}>
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
            <NavigationText
              path={ROUTE.FORGOT_PASSWORD}
              hyperlink="Forgot your password?"
              className="text-right mb-2"
            />
            <SubmitButton loading={loading}>Login</SubmitButton>
          </div>
        </form>
      </Form>

      <Divider text="OR" className={cn("my-2", "text-xs")} />

      <div>
        <GoogleButton />
        <NavigationText
          text="Don't have an account?"
          path={ROUTE.SIGNUP}
          hyperlink="Sign up"
          className={cn("w-full mt-3", "text-center")}
        />
      </div>
    </div>
  );
}
