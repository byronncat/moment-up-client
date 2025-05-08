import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/clientConfig";
import { Metadata } from "@/constants/metadata";

import { PageTitle, ActionableText } from "../../../_components";
import { RecoverPasswordForm } from "./_components";

export const metadata = Metadata.recover;
export default function RecoverPasswordPage() {
  return (
    <main className={cn("w-96 rounded-lg", "px-5 pt-6 pb-5")}>
      <PageTitle title="Trouble logging in?" variant="secondary" />
      <p className="text-sm text-muted-foreground text-center mb-6">
        Please enter your email address to search for your account.
      </p>
      <RecoverPasswordForm />
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
