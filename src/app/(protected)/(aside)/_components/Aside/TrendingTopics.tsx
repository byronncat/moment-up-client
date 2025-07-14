"use client";

import type { Hashtag } from "api";
import type { API } from "api";

import { use } from "react";
import { toast } from "sonner";
import Format from "@/utilities/format";
import { SuggestingApi } from "@/services";
import { ROUTE } from "@/constants/route";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Circle,
  AlertCircle,
  Ban,
  Copy,
} from "@/components/icons";

export default function TrendingSection({
  initialRes,
}: Readonly<{
  initialRes: API<Hashtag[]>;
}>) {
  const response = use(initialRes);
  const topics = response?.data ?? [];

  if (topics?.length === 0) return null;
  return (
    <div className="w-full">
      <SectionHeader className="mb-4">Trending topics</SectionHeader>
      <div>
        {topics?.map((topic) => (
          <TrendingTopicItem key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}

const FEEDBACK_OPTIONS = [
  {
    label: "The associated content is not relevant",
    icon: <Circle variant="x" className="mr-2 size-4" />,
    value: 0,
  },
  {
    label: "This trend is spam",
    icon: <AlertCircle className="mr-2 size-4" />,
    value: 1,
  },
  {
    label: "This trend is abusive or harmful",
    icon: <AlertCircle className="mr-2 size-4" />,
    value: 2,
  },
  {
    label: "Not interested in this",
    icon: <Ban className="mr-2 size-4" />,
    value: 3,
  },
  {
    label: "This trend is a duplicate",
    icon: <Copy className="mr-2 size-4" />,
    value: 4,
  },
  {
    label: "This trend is harmful or spammy",
    icon: <AlertCircle className="mr-2 size-4" />,
    value: 5,
  },
];

function TrendingTopicItem({ topic }: Readonly<{ topic: Hashtag }>) {
  return (
    <div
      className={cn(
        "w-full p-2 rounded-md",
        "hover:bg-accent/[.05] cursor-pointer",
        "transition-colors duration-150 ease-in-out"
      )}
    >
      <Link
        href={ROUTE.SEARCH(`#${topic.id}`)}
        className="flex items-center justify-between"
      >
        <div className="flex flex-col gap-1">
          <div className={cn("block font-semibold text-sm", "hover:underline")}>
            #{topic.id}
          </div>
          <span className="text-xs text-muted-foreground">
            {Format.number(topic.count)} posts
          </span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <FeedbackButton />
        </div>
      </Link>
    </div>
  );
}

function FeedbackButton() {
  async function sendFeedback(feedback: number) {
    toast.promise(SuggestingApi.sendFeedback(feedback), {
      loading: "Submitting feedback...",
      success: (res) => {
        if (res.success) {
          return "Feedback submitted";
        } else throw new Error(res.message);
      },
      error: "Failed to submit feedback",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "rounded-full p-1 cursor-pointer",
            "hover:bg-primary/10 group",
            "transition-colors duration-150 ease-in-out"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal
            className={cn(
              "size-4 text-muted-foreground",
              "group-hover:text-primary",
              "transition-colors duration-150 ease-in-out"
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom">
        {FEEDBACK_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => sendFeedback(option.value)}
            className="cursor-pointer"
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
