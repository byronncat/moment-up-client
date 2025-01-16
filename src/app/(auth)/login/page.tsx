"use client";

import type { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { loginFormSchema } from "@/lib/zodSchema";

import { Button } from "@/components/ui/button";
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
} from "../_components";
import { Divider } from "@/components";
import { ROUTE } from "@/constants/serverConfig";

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identity: "",
      password: "",
    },
  });

  function onLogin(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
  }

  return (
    <div className={clsx("w-96 rounded-lg", "px-5 pt-6 pb-5")}>
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
            <Button
              type="submit"
              className={clsx(
                "size-full h-10",
                "text-white font-semibold",
                "flex justify-center items-center"
              )}
            >
              Login
            </Button>
          </div>
        </form>
      </Form>

      <Divider text="OR" className={clsx("my-2", "text-xs")} />

      <div>
        <GoogleButton />
        <NavigationText
          text="Don't have an account?"
          path={ROUTE.SIGNUP}
          hyperlink="Sign up"
          className={clsx("w-full mt-3", "text-center")}
        />
      </div>
    </div>
  );
}
