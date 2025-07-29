import { redirect } from 'next/navigation';
import { ROUTE } from "@/constants/route";

export default function ExplorePage() {
  redirect(ROUTE.EXPLORE("media"));
}
