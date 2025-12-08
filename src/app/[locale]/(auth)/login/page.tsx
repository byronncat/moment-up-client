import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.login;

import { cn } from "@/libraries/utils";
import {
  ActionableText,
  Divider,
  GoogleButton,
  PageTitle,
} from "../_components";
import LoginForm from "./_components/LoginForm";
import { ROUTE } from "@/constants/route";
import styles from "../_constants/styles";

import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("LoginPage");

  return (
    <main className={styles.form}>
      <PageTitle title={t("title")} />
      <LoginForm />
      <Divider text="OR" className={cn("my-2", "text-xs")} />
      <div>
        <GoogleButton />
        <ActionableText
          path={ROUTE.SIGNUP}
          mutedText="Don't have an account?"
          highlightedText="Sign up"
          className={cn("w-full mt-3", "text-center")}
        />
      </div>
    </main>
  );
}
