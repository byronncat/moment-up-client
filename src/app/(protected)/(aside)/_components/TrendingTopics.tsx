"use client";

import type { HashtagItem } from "schema";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SuggestingApi } from "@/services";
import format from "@/utilities/format";
import { ROUTE } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, XCircle, AlertCircle, Ban, Copy } from "lucide-react";

export default function TrendingSection() {
  const [topics, setTopics] = useState<HashtagItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingTopics() {
      const res = await SuggestingApi.getTrendingTopics();
      if (res.success) setTopics(res.data ?? []);
      else toast.error(res.message || "Failed to load trending topics");
      setIsLoading(false);
    }

    fetchTrendingTopics();
  }, []);

  if (topics?.length === 0) return null;
  return (
    <div className="w-full">
      <SectionHeader className="mb-4" loading={isLoading}>
        Trending topics
      </SectionHeader>
      <div>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <SkeletonTrendingTopicItem key={index} />
            ))
          : topics?.map((topic) => (
              <TrendingTopicItem key={topic.id} topic={topic} />
            ))}
      </div>
    </div>
  );
}

const FEEDBACK_OPTIONS = [
  {
    label: "The associated content is not relevant",
    icon: XCircle,
    value: "not-relevant",
  },
  {
    label: "This trend is spam",
    icon: AlertCircle,
    value: "spam",
  },
  {
    label: "This trend is abusive or harmful",
    icon: AlertCircle,
    value: "abusive",
  },
  {
    label: "Not interested in this",
    icon: Ban,
    value: "not-interested",
  },
  {
    label: "This trend is a duplicate",
    icon: Copy,
    value: "duplicate",
  },
  {
    label: "This trend is harmful or spammy",
    icon: AlertCircle,
    value: "harmful",
  },
];

function TrendingTopicItem({ topic }: { topic: HashtagItem }) {
  return (
    <div
      className={cn(
        "w-full p-2 rounded-md",
        "hover:bg-accent/[.05] cursor-pointer",
        "transition-colors duration-150 ease-in-out"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Link
            href={ROUTE.SEARCH(topic.id)}
            className={cn("block font-semibold text-sm", "hover:underline")}
          >
            #{topic.id}
          </Link>
          <span className="text-xs text-muted-foreground">
            {format.number(topic.count)} posts
          </span>
        </div>
        <FeedbackButton />
      </div>
    </div>
  );
}

function FeedbackButton() {
  const feedbackHandler = (feedback: string) => {
    console.log(feedback);
    toast.success("Feedback submitted");
  };

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
            onClick={() => feedbackHandler(option.value)}
            className="cursor-pointer"
          >
            <option.icon className="mr-2 h-4 w-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SkeletonTrendingTopicItem() {
  return (
    <div className={cn("flex items-center justify-between", "p-2")}>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="size-4" />
    </div>
  );
}
