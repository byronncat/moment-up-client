import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/app/(auth)/_components";
import { ROUTE } from "@/constants/route";

export default function AuthOptions() {
  return (
    <div
      className={cn("w-full px-4 pt-3 pb-5", "border border-border rounded-xl")}
    >
      <h2 className={cn("font-bold text-lg", "mb-1")}>New to MomentUp?</h2>
      <p className="text-xs text-muted-foreground">
        Sign up to connect with the world!
      </p>
      <NavItem className="my-4" />
      <Footer />
    </div>
  );
}

function NavItem({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("flex flex-col gap-y-3", className)}>
      <GoogleButton />
      <Button variant="outline" className="w-full text-sm">
        <Link href={ROUTE.SIGNUP} tabIndex={-1}>
          Sign up with Email
        </Link>
      </Button>
    </div>
  );
}

function Footer() {
  return (
    <span className="block text-xs/normal text-muted-foreground">
      By signing up, you agree to the{" "}
      <a
        href="https://github.com/byronncat/moment-up-client"
        className={cn("hover:underline text-blue-400", "focus-within-indicator rounded-sm")}
        target="_blank"
        rel="noreferrer"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="https://github.com/byronncat/moment-up-client"
        className={cn("hover:underline text-blue-400", "focus-within-indicator rounded-sm")}
        target="_blank"
        rel="noreferrer"
      >
        Terms of Service
      </a>
      , including{" "}
      <a
        href="https://github.com/byronncat/moment-up-client"
        className={cn("hover:underline text-blue-400", "focus-within-indicator rounded-sm")}
        target="_blank"
        rel="noreferrer"
      >
        Cookie Use.
      </a>
    </span>
  );
}
