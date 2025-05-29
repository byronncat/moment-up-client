import { cn } from "@/libraries/utils";
import { Metadata } from "@/constants/metadata";

import Link from "next/link";
import { PageTitle } from "../../../_components";
import { ChangePasswordForm } from "./_components";
import { styles } from "../../../_constants/styles";

export const metadata = Metadata.verify;
export default function VerifyRecoveryPage() {
  return (
    <div className={styles.form}>
      <PageTitle title="Change Password" variant="secondary" />
      <ChangePasswordForm className="mt-4" />
      <Link
        href="/login"
        className={cn(
          "mt-5 float-right",
          "text-muted-foreground text-sm",
          "hover:text-primary hover:underline"
        )}
      >
        Back to Login
      </Link>
    </div>
  );
}
