"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContact } from "../_provider/Contact";

import { cn } from "@/libraries/utils";
import { type NavItem, NavigationBar } from "@/components/common";
import { Input } from "@/components/ui/input";
import UserStatus from "./UserStatus";
import ChatItem from "./ChatItem";
import { MagnifyingGlass, X } from "@/components/icons";
import { ArrowLeft } from "lucide-react";

export default function ChatSidebar({
  className,
}: Readonly<{ className?: string }>) {
  const router = useRouter();
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

  const tabs: NavItem[] = [
    {
      id: "all",
      label: "All",
      onSelect: () => setSelectedFilter("all"),
    },
    {
      id: "inbox",
      label: "Inbox",
      onSelect: () => setSelectedFilter("inbox"),
    },
    {
      id: "groups",
      label: "Groups",
      onSelect: () => setSelectedFilter("groups"),
    },
  ];

  return (
    <div className={cn("border-r border-border", "flex flex-col", className)}>
      <div className="pt-5 px-4 flex items-center">
        <h1 className="text-2xl font-bold">Chats</h1>
        <button
          onClick={() => router.back()}
          className={cn("ml-auto", "text-sm", "hover:underline cursor-pointer")}
        >
          Back
        </button>
      </div>

      <SearchBar query={query} setQuery={setQuery} />

      <UserStatus userStatuses={userStatuses} className="m-3" />

      <NavigationBar items={tabs} className="w-full border-t" />

      <div className="flex-1 overflow-y-auto">
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

type SearchBarProps = Readonly<{
  query: string;
  setQuery: (query: string) => void;
}>;

function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <div className="p-3 relative">
      <MagnifyingGlass
        className={cn(
          "size-4",
          "absolute left-6 top-1/2 -translate-y-1/2 z-10",
          "fill-muted-foreground"
        )}
      />
      <Input
        type="text"
        placeholder="Search Messenger"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={cn("h-10 bg-input pl-9", query && "pr-9")}
      />
      {query ? (
        <button
          onClick={() => setQuery("")}
          className={cn(
            "cursor-pointer group",
            "p-1 rounded-full",
            "absolute right-5 top-1/2 -translate-y-1/2 z-10",
            "hover:bg-accent/7",
            "transition-colors duration-150 ease-in-out"
          )}
        >
          <X className="size-4 text-muted-foreground group-hover:text-foreground" />
        </button>
      ) : null}
    </div>
  );
}
