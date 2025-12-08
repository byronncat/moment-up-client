import { redirect } from "next/navigation";
import { ROUTE } from "@/constants/route";
import { ExploreType } from "@/constants/server";

export default function ExplorePage() {
  redirect(ROUTE.EXPLORE(ExploreType.MEDIA));
}
