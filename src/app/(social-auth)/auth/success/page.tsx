"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/Auth";
import { ROUTE, LOGIN_ERRORS } from "@/constants/route";
import { PAGE_RELOAD_TIME } from "@/constants/clientConfig";
import { LoadingPage } from "@/components/pages";

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setLogged, setLoaded } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    const token = searchParams.get("token");

    if (token) {
      setLogged(true);
      router.push(ROUTE.HOME);

      setTimeout(() => {
        setLoaded(true);
      }, PAGE_RELOAD_TIME);
    } else {
      router.replace(`${ROUTE.LOGIN}?error=${LOGIN_ERRORS.missing_token}`);
    }
  }, [searchParams, router, setLogged, setLoaded]);

  return <LoadingPage />;
}
