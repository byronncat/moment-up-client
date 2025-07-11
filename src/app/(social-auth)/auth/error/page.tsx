"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingPage } from "@/components/pages";
import { ROUTE, LOGIN_ERRORS } from "@/constants/route";

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace(`${ROUTE.LOGIN}?error=${LOGIN_ERRORS.social_auth_failed}`);
    }, 500);
  }, [router]);

  return <LoadingPage />;
}
