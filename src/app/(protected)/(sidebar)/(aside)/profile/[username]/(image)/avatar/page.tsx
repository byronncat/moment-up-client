import { redirect } from "next/navigation";
import { use } from "react";
import { ROUTE } from "@/constants/route";

export default function AvatarPage({
  params,
}: Readonly<{ params: Promise<{ username: string }> }>) {
  const { username } = use(params);
  redirect(ROUTE.PROFILE(username));
}
