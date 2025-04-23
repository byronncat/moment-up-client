import { cn } from "@/lib/utils";
import NavigationBar, {
  type NavItem,
} from "@/components/HorizontalNavigationBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Heart, TableOfContents } from "lucide-react";
import { User } from "@/components/icons";
import { ROUTE } from "@/constants/clientConfig";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>;

export default async function Layout({ children, params }: LayoutProps) {
  const username = (await params).username;

  return (
    <div className={cn("relative", "max-w-2xl mx-auto")}>
      <div className="pb-12">
        <div
          className={cn(
            "mb-4",
            "bg-card rounded-b-lg",
            "dark:border-b border-border",
            "overflow-hidden shadow-sm"
          )}
        >
          <Information username={username} />
          <ContentSelection />
        </div>
        {children}
      </div>
    </div>
  );
}

function Information({ username }: Readonly<{ username?: string }>) {
  return (
    <div className={cn("w-full relative", "flex flex-col items-center")}>
      <div className={cn("w-full h-40 bg-primary/20", "-mb-15")} />

      <Avatar className="size-28">
        <AvatarImage
          src="https://pbs.twimg.com/media/GgHsZ5vakAAz5jI?format=jpg&name=large"
          alt={`${username}'s profile`}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary">
          <User className="size-12 fill-card" type="solid" />
        </AvatarFallback>
      </Avatar>

      <div className={cn("mt-3 mb-6", "flex flex-col items-center")}>
        <span className="font-semibold text-xl">{username}</span>
        <span className="text-muted-foreground text-sm">@{username}</span>
        <p className="mt-3 text-muted-foreground">
          Description about me goes here
        </p>
      </div>

      <div className={cn("grid grid-cols-2 gap-10", "text-sm", "mb-6")}>
        <div className="flex flex-col items-center">
          <span className="font-bold">10</span>
          <span>Following</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">1.20 K</span>
          <span>Followers</span>
        </div>
      </div>

      <Button
        className={cn(
          "my-5 px-5 py-2",
          "font-semibold text-sm",
          "absolute top-38 right-2"
        )}
        variant="outline"
      >
        Edit profile
      </Button>
    </div>
  );
}

const tabs: NavItem[] = [
  {
    id: "moments",
    label: "Moments",
    icon: <TableOfContents />,
    href: ROUTE.PROFILE("username"),
  },
  {
    id: "media",
    label: "Media",
    icon: <Image aria-label="User's media" />,
    href: ROUTE.PROFILE("username", "media"),
  },
  {
    id: "likes",
    label: "Likes",
    icon: <Heart />,
    href: ROUTE.PROFILE("username", "likes"),
  },
];
function ContentSelection() {
  return (
    <NavigationBar
      items={tabs}
      className={cn("w-full", "border-t border-border border-b-0")}
    />
  );
}
