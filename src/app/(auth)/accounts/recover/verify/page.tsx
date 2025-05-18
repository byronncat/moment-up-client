import { cn } from "@/libraries/utils";
import { Metadata } from "@/constants/metadata";

import { PageTitle } from "../../../_components";
import { ChangePasswordForm } from "./_components";
import Link from "next/link";

export const metadata = Metadata.verify;
export default function VerifyRecoveryPage() {
  return (
    <div className={cn("w-96 rounded-lg", "px-5 pt-6 pb-5")}>
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
