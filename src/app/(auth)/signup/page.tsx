import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";
import { Metadata } from "@/constants/metadata";

import {
  ActionableText,
  Divider,
  GoogleButton,
  PageTitle,
} from "../_components";
import SignupForm from "./_components/SignupForm";
import { styles } from "../_constants/styles";

export const metadata = Metadata.signup;
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
