import { redirect } from "next/navigation";
import { ROUTE } from "@/constants/route";

export default function CreatePostPage() {
  redirect(ROUTE.HOME);
}
