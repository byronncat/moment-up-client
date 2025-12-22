"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { ActionableText, PageTitle } from "../_components";
import { ChangePasswordForm, SendOtpForm } from "./_components";
import { ROUTE } from "@/constants/route";
import styles from "../_constants/styles";

export default function VerifyRecoveryPage() {
  const t = useTranslations("ForgotPasswordPage");
  const [user, setUser] = useState<string>("");

  return (
    <main className={styles.form}>
      {user ? (
        <>
          <PageTitle title={t("changePasswordTitle")} variant="secondary" />
          <ChangePasswordForm className="mt-4" defaultValue={user} />
          <Link
            href={ROUTE.LOGIN}
            className={cn(
              "mt-5 float-right",
              "text-muted-foreground text-sm",
              "hover:text-primary hover:underline",
              "focus-within-indicator rounded-sm"
            )}
          >
            {t("backToLogin")}
          </Link>
        </>
      ) : (
        <>
          <PageTitle title={t("troubleTitle")} variant="secondary" />
          <p className="text-sm text-muted-foreground text-center mb-6">
            {t("troubleDescription")}
          </p>
          <SendOtpForm
            onSuccess={(data) => {
              setUser(data);
            }}
          />
          <div className="mt-4">
            <ActionableText
              mutedText={t("rememberPasswordText")}
              path={ROUTE.LOGIN}
              highlightedText={t("loginLink")}
              className={cn("w-full", "text-center")}
            />
          </div>
        </>
      )}
    </main>
  );
}
