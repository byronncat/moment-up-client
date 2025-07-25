import { Audience } from "@/constants/serverConfig";
import { Globe, User, Shield, Lock } from "@/components/icons";

export type AudienceOption = {
  label: string;
  value: Audience;
  icon: React.ReactNode;
  description: string;
};

export const AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    label: "Public",
    value: Audience.PUBLIC,
    icon: <Globe className="size-4" />,
    description: "Anyone can see this",
  },
  {
    label: "Friends",
    value: Audience.FRIENDS,
    icon: <User multiple className="size-4" />,
    description: "Only your friends",
  },
  {
    label: "Followers",
    value: Audience.FOLLOWERS,
    icon: <User variant="check" className="size-4" />,
    description: "People who follow you",
  },
  {
    label: "Verified",
    value: Audience.VERIFIED,
    icon: <Shield variant="check" className="size-4" />,
    description: "Only verified accounts",
  },
  {
    label: "Only me",
    value: Audience.ONLY_ME,
    icon: <Lock className="size-4" />,
    description: "Only you can see this",
  },
];
