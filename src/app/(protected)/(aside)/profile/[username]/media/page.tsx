import { use } from "react";
import { UserApi } from "@/services";
import { MomentGrid } from "../_components";

type ProfileMomentsProps = Readonly<{
  params: Promise<{ username: string }>;
}>;

export default function ProfileMomentsPage({ params }: ProfileMomentsProps) {
  const username = use(params).username;
  const momentsRes = UserApi.getMoments("media", username, 0);
  return <MomentGrid username={username} initialRes={momentsRes} />;
}
