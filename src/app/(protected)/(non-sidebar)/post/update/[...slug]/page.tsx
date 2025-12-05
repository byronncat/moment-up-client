import { redirect } from "next/navigation";
import { ROUTE } from "@/constants/route";

export default function UpdatePostPage() {
  redirect(ROUTE.HOME);
}
