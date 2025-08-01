"use server";

import { cn } from "@/libraries/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SERVER_HOST_URL } from "@/constants/serverConfig";

async function handleGoogleLogin() {
  "use server";
  redirect(`${SERVER_HOST_URL}/v1/auth/google`);
}

export default async function GoogleButton() {
  return (
    <form action={handleGoogleLogin}>
      <button
        type="submit"
        className={cn(
          "cursor-pointer",
          "size-full h-10 rounded-lg",
          "flex justify-center items-center gap-x-2",
          "bg-white text-black/[.8]",
          "text-sm font-semibold",
          "dark:hover:bg-white/[.7] hover:bg-black/[.08]",
          "transition-colors duration-200 ease-in-out"
        )}
      >
        <span>
          <Image
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="
            alt="Google Icon"
            width={20}
            height={20}
          />
        </span>
        Sign in with Google
      </button>
    </form>
  );
}
