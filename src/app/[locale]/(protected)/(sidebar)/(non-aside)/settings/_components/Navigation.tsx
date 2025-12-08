import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/libraries/utils";
import {
  Ban,
  Bell,
  CaseSensitive,
  Eye,
  Globe,
  GlobeLock,
  Hash,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Lock,
  MessageCircle,
  Settings2,
  ShieldUser,
  User,
  UserLock,
  UserStar,
  VolumeX,
} from "lucide-react";
import { useSettings } from "../_providers/Settings";

export default function Navigation() {
  const { open } = useSidebar();
  const { setCurrentTitle } = useSettings();

  return (
    <nav
      className={cn("w-[300px] h-full bg-sidebar", "border-r border-border")}
    >
      <div
        className={cn(
          "text-xl font-semibold",
          open ? "pt-6 pl-4" : "pt-5 pl-12"
        )}
      >
        Settings
      </div>

      <div className="p-2">
        {menuItems.map((item) => (
          <MenuGroup
            key={item.title}
            title={item.title}
            items={item.items}
            onItemClick={setCurrentTitle}
          />
        ))}
      </div>
    </nav>
  );
}

type MenuItem = {
  title: string;
  icon: React.ReactNode;
};

function MenuGroup({
  title,
  items,
  onItemClick,
}: {
  title: string;
  items: MenuItem[];
  onItemClick: (title: string) => void;
}) {
  const { currentTitle } = useSettings();

  return (
    <div className="p-2">
      <h3 className={cn("text-xs text-muted-foreground", "px-2 mb-1.5")}>
        {title}
      </h3>
      <ul className={cn("flex flex-col gap-1", "text-sm")}>
        {items.map((item) => (
          <li
            key={item.title}
            onClick={() => onItemClick(item.title)}
            className={cn(
              "px-2 h-8",
              "flex items-center gap-2",

              currentTitle === item.title
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md cursor-pointer"
            )}
          >
            {item.icon}
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

const menuItems = [
  {
    title: "General",
    items: [
      {
        title: "Your profile",
        icon: <Settings2 className="size-4" />,
      },
      {
        title: "Password and security",
        icon: <Lock className="size-4" />,
      },
      {
        title: "Notifications",
        icon: <Bell className="size-4" />,
      },
      {
        title: "Language",
        icon: <Globe className="size-4" />,
      },
    ],
  },
  {
    title: "Who can see your content",
    items: [
      {
        title: "Account privacy",
        icon: <GlobeLock className="size-4" />,
      },
      {
        title: "Close friends",
        icon: <UserStar className="size-4" />,
      },
      {
        title: "Blocked",
        icon: <Ban className="size-4" />,
      },
      {
        title: "Story visibility",
        icon: <ImageIcon className="size-4" />,
      },
    ],
  },
  {
    title: "How others can interact with you",
    items: [
      {
        title: "Comments",
        icon: <MessageCircle className="size-4" />,
      },
      {
        title: "Tags and mentions",
        icon: <Hash className="size-4" />,
      },
      {
        title: "Hidden words",
        icon: <CaseSensitive className="size-4" />,
      },
      {
        title: "Profile visibility",
        icon: <UserLock className="size-4" />,
      },
    ],
  },
  {
    title: "What you see",
    items: [
      {
        title: "Muted accounts",
        icon: <VolumeX className="size-4" />,
      },
      {
        title: "Content preferences",
        icon: <Eye className="size-4" />,
      },
      {
        title: "Like and share counts",
        icon: <Heart className="size-4" />,
      },
    ],
  },
  {
    title: "More info and support",
    items: [
      {
        title: "Help center",
        icon: <HelpCircle className="size-4" />,
      },
      {
        title: "Privacy policy",
        icon: <ShieldUser className="size-4" />,
      },
      {
        title: "Account status",
        icon: <User className="size-4" />,
      },
    ],
  },
];
