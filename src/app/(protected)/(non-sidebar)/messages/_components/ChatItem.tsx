import type { ContactDto } from "api";

import Link from "next/link";
import { cn } from "@/libraries/utils";

import { Avatar } from "@/components/common";
import { ROUTE } from "@/constants/route";

type ChatItemProps = Readonly<{
  isActive: boolean;
  contact: ContactDto;
  onSelectContact: (contactId: string) => void;
}>;

export default function ChatItem({
  isActive,
  contact,
  onSelectContact,
}: ChatItemProps) {
  return (
    <Link
      href={ROUTE.MESSAGE(contact.id)}
      className={cn(
        "flex items-center p-3 hover:bg-accent/[.05] cursor-pointer",
        isActive && "bg-accent/[.05]"
      )}
      onClick={() => onSelectContact(contact.id)}
    >
      <div className="relative mr-3">
        {contact.avatar ? (
          <Avatar src={contact.avatar} alt={contact.name} size="12" />
        ) : (
          <GroupAvatar
            avatar1={contact.members?.[0].avatar}
            avatar2={contact.members?.[1].avatar}
          />
        )}
        {contact.isActive ? (
          <span
            className={cn(
              "absolute bottom-0 right-0",
              "size-3 bg-green-500 rounded-full",
              "border-2 border-background"
            )}
          />
        ) : null}
      </div>
      <div className="grow min-w-0">
        <div className="flex justify-between">
          <p className="font-medium truncate">{contact.name}</p>
          <span className="text-xs text-muted-foreground">
            {contact.timestamp}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {contact.lastMessage}
        </p>
      </div>
    </Link>
  );
}

function GroupAvatar({
  avatar1,
  avatar2,
}: Readonly<{ avatar1?: string; avatar2?: string }>) {
  if (!avatar1 || !avatar2)
    return <Avatar src={avatar1 ?? avatar2} alt="" size="12" />;

  return (
    <div className="relative size-12">
      <Avatar
        src={avatar1}
        alt=""
        size="12"
        className={cn(
          "absolute bottom-0 left-0 z-10",
          "size-9 rounded-full",
          "overflow-hidden",
          "border-2 border-background"
        )}
      />
      <Avatar
        src={avatar2}
        alt=""
        size="12"
        className={cn(
          "absolute top-0 right-0",
          "size-9 rounded-full",
          "overflow-hidden",
          "border-2 border-background"
        )}
      />
    </div>
  );
}
