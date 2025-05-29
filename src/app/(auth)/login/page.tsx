import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";
import { Metadata } from "@/constants/metadata";

import {
  ActionableText,
  Divider,
  GoogleButton,
  PageTitle,
} from "../_components";
import { LoginForm } from "./_components";
import { styles } from "../_constants/styles";

export const metadata = Metadata.login;
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
