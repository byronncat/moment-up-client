import { redirect } from "next/navigation";
import { use } from "react";
import { ROUTE } from "@/constants/route";

export default function HeaderPhotoPage({
  params,
}: Readonly<{ params: Promise<{ username: string }> }>) {
  const { username } = use(params);
  redirect(ROUTE.PROFILE(username));
}
