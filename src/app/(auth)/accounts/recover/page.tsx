"use client";

import type { z } from "zod";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { recoverPasswordSchema } from "@/lib/zodSchema";
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
import { NavigationText, PageTitle, SubmitButton } from "../../_components";

export default function RecoverPasswordPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof recoverPasswordSchema>>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [loading, setLoading] = useState(false);
  async function onRecover(values: z.infer<typeof recoverPasswordSchema>) {
    setLoading(true);
    // TODO: Implement password recovery
    console.log(values);
    // Simulate sending recovery email
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(ROUTE.VERIFY_RECOVERY);
    setLoading(false);
  }

  return (
    <div className={clsx("w-96 rounded-lg", "px-5 pt-6 pb-5")}>
      <PageTitle title="Trouble logging in?" variant="secondary" />
      <p className="text-sm text-muted-foreground text-center mb-6">
        Please enter your email address to search for your account.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onRecover)}>
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
          </div>

          <div className="mt-5">
            <SubmitButton loading={loading}>Send Recovery Email</SubmitButton>
          </div>
        </form>
      </Form>

      <div className="mt-4">
        <NavigationText
          text="Remember your password?"
          path={ROUTE.LOGIN}
          hyperlink="Login"
          className={clsx("w-full", "text-center")}
        />
      </div>
    </div>
  );
}
