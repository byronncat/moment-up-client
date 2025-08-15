import { redirect } from "next/navigation";
import { ROUTE } from "@/constants/route";
import { ExploreType } from "@/constants/serverConfig";

export default function ExplorePage() {
  redirect(ROUTE.EXPLORE(ExploreType.MEDIA));
}
