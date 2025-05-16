import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";
import { Metadata } from "@/constants/metadata";

import {
  ActionableText,
  Divider,
  GoogleButton,
  PageTitle,
} from "../_components";
import { SignupForm } from "./_components";

export const metadata = Metadata.signup;
export default function SignUpPage() {
  return (
    <main className={cn("w-96 rounded-lg", "px-5 pt-6 pb-5", "relative")}>
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
