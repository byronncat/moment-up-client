"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LOGIN_ERRORS, ROUTE } from "@/constants/route";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";
import { LoadingPage } from "@/components/pages";

export default function FailedLogin() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace(`${ROUTE.LOGIN}?error=${LOGIN_ERRORS.social_auth_failed}`);
    }, PAGE_RELOAD_TIME);
  }, [router]);

  return <LoadingPage />;
}
