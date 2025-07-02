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
import { styles } from "../_constants/styles";

export default function LoginPage() {
  return (
    <main className={styles.form}>
      <PageTitle title="Login" />
      <LoginForm />
      <Divider text="OR" className={cn("my-2", "text-xs")} />

      <div>
        <GoogleButton />
        <ActionableText
          mutedText="Don't have an account?"
          path={ROUTE.SIGNUP}
          highlightedText="Sign up"
          className={cn("w-full mt-3", "text-center")}
        />
      </div>
    </main>
  );
}
