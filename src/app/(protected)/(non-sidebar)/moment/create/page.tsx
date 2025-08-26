import { redirect } from "next/navigation";
import { ROUTE } from "@/constants/route";

export default function CreateMomentPage() {
  redirect(ROUTE.HOME);
}
