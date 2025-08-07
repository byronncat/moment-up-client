import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/app/(auth)/_components";

import { ROUTE } from "@/constants/route";

export default function NoAuth() {
  return (
    <div
      className={cn("w-full px-4 pt-3 pb-5", "border border-border rounded-xl")}
    >
      <Header />
      <NavItem className="my-4" />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div>
      <h2 className={cn("font-bold text-lg", "mb-1")}>New to MomentUp?</h2>
      <p className="text-xs text-muted-foreground">
        Sign up to connect with the world!
      </p>
    </div>
  );
}

function NavItem({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("flex flex-col gap-y-3", className)}>
      <GoogleButton />
      <Link href={ROUTE.SIGNUP}>
        <Button variant="outline" className="w-full text-sm">
          Sign up with Email
        </Button>
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <p className="text-xs text-muted-foreground">
      By signing up, you agree to the{" "}
      <a href="#" className="underline text-blue-400">
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="#" className="underline text-blue-400">
        Privacy Policy
      </a>
      , including{" "}
      <a href="#" className="underline text-blue-400">
        Cookie Use.
      </a>
    </p>
  );
}
