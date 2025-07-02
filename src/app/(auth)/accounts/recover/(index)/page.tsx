import { cn } from "@/libraries/utils";
import { ROUTE } from "@/constants/route";
import { Metadata } from "@/constants/metadata";

import { PageTitle, ActionableText } from "../../../_components";
import RecoverPasswordForm from "./_components/RecoverPasswordForm";
import { styles } from "../../../_constants/styles";

export const metadata = Metadata.recover;
export default function RecoverPasswordPage() {
  return (
    <main className={styles.form}>
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
