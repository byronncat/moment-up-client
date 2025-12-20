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
import SignupForm from "./_components/SignupForm";
import { ROUTE } from "@/constants/route";
import styles from "../_constants/styles";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SignupPage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SignUpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("SignupPage");

  return (
    <main className={cn(styles.form, "relative")}>
      <PageTitle title={t("title")} />
      <SignupForm />
      <Divider text={t("orDivider")} className={cn("my-2", "text-xs")} />
      <div>
        <GoogleButton label={t("googleSignupButton")} />
        <ActionableText
          mutedText={t("alreadyHaveAccountText")}
          path={ROUTE.LOGIN}
          highlightedText={t("loginLink")}
          className={cn("w-full mt-3", "text-center")}
        />
      </div>
      <AgreementText className="mt-4" />
    </main>
  );
}
