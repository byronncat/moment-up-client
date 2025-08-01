import type { ProfileInfo } from "api";
import { cn } from "@/libraries/utils";
import ProfileZone from "./ProfileZone";

type ProfileWrapperProps = Readonly<{
  data: ProfileInfo;
  children: React.ReactNode;
}>;

export default function ProfileWrapper({
  data: profile,
  children,
}: ProfileWrapperProps) {
  return (
    <div>
      <ProfileZone data={profile} />
      <div
        className={cn(
          "flex flex-col gap-4",
          "max-w-[600px] size-full mx-auto",
          "pt-4"
        )}
      >
        {children}
      </div>
    </div>
  );
}
