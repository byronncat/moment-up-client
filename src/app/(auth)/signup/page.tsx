"use client";

import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { signupFormSchema } from "@/lib/zodSchema";
import { useAuth } from "@/components/providers";
import { ROUTE } from "@/constants/serverConfig";

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

import {
  GoogleButton,
  NavigationText,
  PageTitle,
  PasswordInput,
  SubmitButton,
} from "../_components";
import { Divider } from "@/components";
import { CircleInfo } from "@/components/icons";

export default function SignUpPage() {
  const { signup } = useAuth();
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "ByronAT445@gmail.com",
      username: "Byron",
      password: "12345678",
    },
  });

  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  async function onSignup(values: z.infer<typeof signupFormSchema>) {
    setLoading(true);
    await signup(values);
    setLoading(false);
  }

  return (
    <div className={clsx("w-96 rounded-lg", "px-5 pt-6 pb-5", "relative")}>
      <PageTitle title="Sign up" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDetails(!showDetails)}
        className="absolute top-7 right-3 "
      >
        <CircleInfo className="fill-blue-500 dark:fill-blue-400" />
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSignup)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="h-10 bg-card"
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
                      className="h-10 bg-card"
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
                      className="h-10 bg-card"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  {showDetails && (
                    <FormDescription className="text-xs">
                      Password must be at least 8 characters
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton loading={loading}>Sign up</SubmitButton>
        </form>
      </Form>

      <Divider text="OR" className={clsx("my-2", "text-xs")} />

      <div>
        <GoogleButton />
        <NavigationText
          text="Already have an account?"
          path={ROUTE.LOGIN}
          hyperlink="Login"
          className={clsx("w-full mt-3", "text-center")}
        />
      </div>
    </div>
  );
}
