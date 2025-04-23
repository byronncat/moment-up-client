"use client";

import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/lib/zodSchema";
import { useAuth } from "@/components/providers";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "../../../../_components";

export default function RecoverPasswordForm() {
  const { sendRecoveryEmail } = useAuth();
  const form = useForm<z.infer<typeof zodSchema.auth.sendRecoveryEmail>>({
    resolver: zodResolver(zodSchema.auth.sendRecoveryEmail),
    defaultValues: {
      email: "",
    },
  });

  const [loading, setLoading] = useState(false);
  async function sendEmailHandler(
    values: z.infer<typeof zodSchema.auth.sendRecoveryEmail>
  ) {
    setLoading(true);
    toast.promise(sendRecoveryEmail(values), {
      loading: "Sending recovery email...",
      success: (res) => {
        setLoading(false);
        if (res.success) return "Recovery email sent!";
        throw new Error(res.message);
      },
      error: (err) => err.message,
    });
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(sendEmailHandler)}>
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
  );
}
