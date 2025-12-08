import { Metadata } from "@/constants/metadata";
export const metadata = Metadata.signup;

import { cn } from "@/libraries/utils";
import {
  ActionableText,
  Divider,
  GoogleButton,
  PageTitle,
} from "../_components";
import SignupForm from "./_components/SignupForm";
import { ROUTE } from "@/constants/route";
import styles from "../_constants/styles";

export default function SignUpPage() {
  return (
    <main className={cn(styles.form, "relative")}>
      <PageTitle title="Sign up" />
      <SignupForm />
      <Divider text="OR" className={cn("my-2", "text-xs")} />
      <div>
        <GoogleButton />
        <ActionableText
          mutedText="Already have an account?"
          path={ROUTE.LOGIN}
          highlightedText="Login"
          className={cn("w-full mt-3", "text-center")}
        />
      </div>
    </main>
  );
}
