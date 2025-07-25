"use client";

import { useState } from "react";
import { cn } from "@/libraries/utils";
import Link from "next/link";
import { PageTitle, ActionableText } from "../_components";
import { SendOtpForm, ChangePasswordForm } from "./_components";
import styles from "../_constants/styles";
import { ROUTE } from "@/constants/route";

export default function VerifyRecoveryPage() {
  const [user, setUser] = useState<string>("");

  return user ? (
    <main className={styles.form}>
      <PageTitle title="Change Password" variant="secondary" />
      <ChangePasswordForm className="mt-4" defaultValue={user} />
      <Link
        href="/login"
        className={cn(
          "mt-5 float-right",
          "text-muted-foreground text-sm",
          "hover:text-primary hover:underline"
        )}
      >
        Back to Login
      </Link>
    </main>
  ) : (
    <main className={styles.form}>
      <PageTitle title="Trouble logging in?" variant="secondary" />
      <p className="text-sm text-muted-foreground text-center mb-6">
        Please enter your email address to search for your account.
      </p>
      <SendOtpForm
        onSuccess={(data) => {
          setUser(data);
        }}
      />
      <div className="mt-4">
        <ActionableText
          mutedText="Remember your password?"
          path={ROUTE.LOGIN}
          highlightedText="Login"
          className={cn("w-full", "text-center")}
        />
      </div>
    </main>
  );
}
