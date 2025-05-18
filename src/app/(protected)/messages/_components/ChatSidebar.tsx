"use client";

import { type Contact, type UserStatus } from "@/__mocks__";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/libraries/utils";

import { useContact } from "../_provider/Contact";
import { NavigationBar, type NavItem } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass, XMark } from "@/components/icons";
import { ROUTE } from "@/constants/clientConfig";

export default function ChatSidebar() {
  const { contacts, currentContactId, setCurrentContactId, userStatuses } =
    useContact();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "inbox" | "groups"
  >("all");
  const [query, setQuery] = useState("");
  const filteredContacts = contacts?.filter((contact) => {
    if (query && !contact.name.toLowerCase().includes(query.toLowerCase()))
      return false;
    if (selectedFilter === "inbox" && contact.type !== "user") return false;
    if (selectedFilter === "groups" && contact.type !== "group") return false;

    return true;
  });

  return (
    <div
      className={cn(
        "w-[20rem] box-content",
        "border-r border-border",
        "flex flex-col"
      )}
    >
      <SidebarHeader title="Chats" />
      <SearchBar query={query} setQuery={setQuery} />
      <UserStatus userStatuses={userStatuses} className="pb-5" />
      <ChatTypeSelection onFilterChange={setSelectedFilter} />

      <div className="overflow-y-auto flex-1">
        {filteredContacts ? (
          filteredContacts.map((contact) => (
            <ChatItem
              key={contact.id}
              isActive={contact.id === currentContactId}
              contact={contact}
              onSelectContact={setCurrentContactId}
            />
          ))
        ) : (
          <div className="size-full flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              No messages found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarHeader({ title }: Readonly<{ title: string }>) {
  return (
    <div className="pt-7 p-4 flex items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}

type SearchBarProps = Readonly<{
  query: string;
  setQuery: (query: string) => void;
}>;

function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <div className="p-3">
      <div className="relative">
        <MagnifyingGlass
          className={cn(
            "size-4",
            "absolute left-3 top-1/2 -translate-y-1/2 z-10",
            "fill-muted-foreground"
          )}
        />
        <Input
          type="text"
          placeholder="Search Messenger"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn("h-10 bg-card pl-9", query && "pr-9")}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className={cn(
              "cursor-pointer",
              "p-1 rounded-full",
              "absolute right-3 top-1/2 -translate-y-1/2 z-10",
              "hover:bg-accent/[.07]",
              "transition-colors duration-150 ease-in-out"
            )}
          >
            <XMark className="size-3 fill-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

type ChatTypeSelectionProps = Readonly<{
  onFilterChange: (filter: "all" | "inbox" | "groups") => void;
}>;

function ChatTypeSelection({ onFilterChange }: ChatTypeSelectionProps) {
  const tabs: NavItem[] = [
    {
      id: "all",
      label: "All",
      onSelect: () => onFilterChange("all"),
    },
    {
      id: "inbox",
      label: "Inbox",
      onSelect: () => onFilterChange("inbox"),
    },
    {
      id: "groups",
      label: "Groups",
      onSelect: () => onFilterChange("groups"),
    },
  ];

  return <NavigationBar items={tabs} className="mb-5 w-full" />;
}

function GroupAvatar({
  avatar1,
  avatar2,
}: Readonly<{ avatar1?: string; avatar2?: string }>) {
  if (!avatar1 || !avatar2) {
    return (
      <Avatar className="size-12">
        <AvatarImage src={avatar1 || avatar2} alt="" />
        <AvatarFallback>{avatar1 || avatar2}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="relative size-12">
      <Avatar
        className={cn(
          "absolute bottom-0 left-0 z-10",
          "size-9 rounded-full",
          "overflow-hidden",
          "border-2 border-background"
        )}
      >
        <AvatarImage src={avatar1} alt="" className="size-full object-cover" />
        <AvatarFallback>{avatar1}</AvatarFallback>
      </Avatar>
      <Avatar
        className={cn(
          "absolute top-0 right-0",
          "size-9 rounded-full",
          "overflow-hidden",
          "border-2 border-background"
        )}
      >
        <AvatarImage src={avatar2} alt="" className="size-full object-cover" />
        <AvatarFallback>{avatar2}</AvatarFallback>
      </Avatar>
    </div>
  );
}

type ChatItemProps = Readonly<{
  isActive: boolean;
  contact: Contact;
  onSelectContact: (contactId: string) => void;
}>;

function ChatItem({ isActive, contact, onSelectContact }: ChatItemProps) {
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
          <Avatar className="size-12">
            <AvatarImage
              src={contact.avatar}
              alt={contact.name}
              className="object-cover"
            />
            <AvatarFallback>{contact.name[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <GroupAvatar
            avatar1={contact.members?.[0].avatar}
            avatar2={contact.members?.[1].avatar}
          />
        )}
        {contact.isActive && (
          <span
            className={cn(
              "absolute bottom-0 right-0",
              "size-3 bg-green-500 rounded-full",
              "border-2 border-background"
            )}
          ></span>
        )}
      </div>
      <div className="grow min-w-0">
        <div className="flex justify-between">
          <p className="font-medium truncate">{contact.name}</p>
          <span className="text-xs text-muted-foreground">{contact.time}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {contact.lastMessage}
        </p>
      </div>
    </Link>
  );
}

type UserStatusProps = Readonly<{
  userStatuses: UserStatus[];
  className?: string;
}>;

function UserStatus({ userStatuses, className }: UserStatusProps) {
  return (
    <div className={cn("p-3", "border-b border-border", className)}>
      <div
        className={cn(
          "flex items-center gap-2",
          "pb-2",
          "overflow-x-auto scrollbar-hide"
        )}
      >
        <Link href={ROUTE.THOUGHT} className="flex flex-col items-center gap-1">
          <div className="relative">
            <Avatar className="size-15">
              <AvatarImage src="/note.png" alt="Your note" />
              <AvatarFallback>Note</AvatarFallback>
            </Avatar>
          </div>
          <span
            className={cn(
              "text-xs text-muted-foreground",
              "truncate max-w-14",
              "text-center"
            )}
          >
            Your note
          </span>
        </Link>

        {userStatuses.map((user) => (
          <div key={user.id} className="flex flex-col items-center gap-1">
            <div className="relative">
              <Avatar className="size-15">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                  className="object-cover object-top"
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute bottom-0 right-0",
                  "size-3 bg-green-500 rounded-full",
                  "border-2 border-background",
                  user.isActive && "bg-green-500"
                )}
              ></span>
            </div>
            <span
              className={cn(
                "text-xs text-muted-foreground",
                "truncate max-w-14",
                "text-center",
                user.isActive && "text-foreground"
              )}
            >
              {user.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
