import type { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema from "@/libraries/zodSchema";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "../../_components";
import styles from "../../_constants/styles";

export default function SendOtpForm({
  onSuccess,
}: Readonly<{
  onSuccess: (data: string) => void;
}>) {
  const form = useForm<z.infer<typeof zodSchema.auth.sendOtpEmail>>({
    resolver: zodResolver(zodSchema.auth.sendOtpEmail),
    defaultValues: {
      identity: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const { sendOtpEmail } = useAuth();
  async function sendEmailHandler(
    values: z.infer<typeof zodSchema.auth.sendOtpEmail>
  ) {
    setLoading(true);
    const { success, message } = await sendOtpEmail(values);
    if (success) onSuccess(values.identity);
    else toast.error(message);
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(sendEmailHandler)}>
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
        </div>

        <div className="mt-5">
          <SubmitButton loading={loading}>Send Recovery Email</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
