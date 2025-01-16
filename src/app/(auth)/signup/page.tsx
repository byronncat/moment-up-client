"use client";

import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { signupFormSchema } from "@/lib/zodSchema";

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
} from "../_components";
import { Divider } from "@/components";
import { ROUTE } from "@/constants/serverConfig";

export default function SignUpPage() {
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  function onSignup(values: z.infer<typeof signupFormSchema>) {
    console.log(values);
  }

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={clsx("w-96 rounded-lg", "px-5 pt-6 pb-5", "relative")}>
      <PageTitle title="Sign up" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDetails(!showDetails)}
        className="absolute top-7 right-3 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="fill-blue-500 dark:fill-blue-400"
        >
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>
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
                      {...field}
                      className="h-10 bg-card"
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
                      {...field}
                      className="h-10 bg-card"
                    />
                  </FormControl>
                  {showDetails && (
                    <FormDescription className="text-xs">
                      Only letters, numbers, dots, underscores, and hyphens are
                      allowed.
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
                      type="password"
                      placeholder="Pasword"
                      {...field}
                      className="h-10 bg-card"
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

          <Button
            type="submit"
            className={clsx(
              "size-full h-10 mt-6",
              "text-white font-semibold",
              "flex justify-center items-center"
            )}
          >
            Sign up
          </Button>
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
