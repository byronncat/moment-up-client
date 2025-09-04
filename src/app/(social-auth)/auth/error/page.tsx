"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ROUTE } from "@/constants/route";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";
import { LoadingPage } from "@/components/pages";

export default function FailedLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setTimeout(() => {
      const errorCode = searchParams.get("code");
      router.replace(
        `${ROUTE.LOGIN}?error=${encodeURIComponent(errorCode ?? "")}`
      );
    }, PAGE_RELOAD_TIME);
  }, [router, searchParams]);

  return <LoadingPage />;
}
