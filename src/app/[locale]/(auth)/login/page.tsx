import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { cn } from "@/libraries/utils";
import {
  ActionableText,
  AgreementText,
  Divider,
  GoogleButton,
  PageTitle,
} from "../_components";
import LoginForm from "./_components/LoginForm";
import { ROUTE } from "@/constants/route";
import styles from "../_constants/styles";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LoginPage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LoginPage");

  return (
    <main className={styles.form}>
      <PageTitle title={t("title")} />
      <LoginForm />
      <Divider text={t("orDivider")} className={cn("my-2", "text-xs")} />
      <div>
        <GoogleButton label={t("googleLoginButton")} />
        <ActionableText
          path={ROUTE.SIGNUP}
          mutedText={t("dontHaveAccountText")}
          highlightedText={t("signUpLink")}
          className={cn("w-full mt-3", "text-center")}
        />
      </div>
      <AgreementText className="mt-4" />
    </main>
  );
}
