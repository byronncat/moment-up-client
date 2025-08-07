"use client";

import type { Hashtag } from "api";

import { useRefreshApi } from "@/components/providers";
import useSWRImmutable from "swr/immutable";
import { SWRFetcher } from "@/libraries/swr";
import { toast } from "sonner";
import { SuggestApi, ApiUrl } from "@/services";
import Format from "@/utilities/format";
import { ROUTE } from "@/constants/route";
import { ReportType } from "@/constants/serverConfig";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SectionHeader, { HeaderSkeleton } from "./SectionHeader";
import {
  MoreHorizontal,
  Circle,
  AlertCircle,
  Ban,
  Copy,
} from "@/components/icons";

const FEEDBACK_OPTIONS = [
  {
    label: "The associated content is not relevant",
    icon: <Circle variant="x" className="mr-2 size-4" />,
    value: ReportType.NOT_RELEVANT,
  },
  {
    label: "This trend is spam",
    icon: <AlertCircle className="mr-2 size-4" />,
    value: ReportType.SPAM,
  },
  {
    label: "This trend is abusive or harmful",
    icon: <AlertCircle className="mr-2 size-4" />,
    value: ReportType.ABUSIVE,
  },
  {
    label: "Not interested in this",
    icon: <Ban className="mr-2 size-4" />,
    value: ReportType.NOT_INTERESTED,
  },
  {
    label: "This trend is a duplicate",
    icon: <Copy className="mr-2 size-4" />,
    value: ReportType.DUPLICATE,
  },
  {
    label: "This trend is harmful or spammy",
    icon: <AlertCircle className="mr-2 size-4" />,
    value: ReportType.HARMFUL,
  },
];

export default function TrendingTopics() {
  const { data, isLoading, error } = useSWRImmutable(
    ApiUrl.suggestion.trending,
    SWRFetcher<{ topics: Hashtag[] }>
  );

  if (isLoading) return <TrendingTopicsSkeleton />;
  if (!data || data.topics.length === 0 || error) return null;
  return (
    <div className="w-full">
      <SectionHeader className="mb-4">Trending topics</SectionHeader>
      <div>
        {data.topics.map((topic) => (
          <TrendingTopicItem key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}

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
        <div onClick={(event) => event.stopPropagation()}>
          <ReportButton topicId={topic.id} />
        </div>
      </Link>
    </div>
  );
}

function ReportButton({ topicId }: Readonly<{ topicId: Hashtag["id"] }>) {
  const reportTopic = useRefreshApi(SuggestApi.reportTopic);

  async function report(reportType: ReportType) {
    toast.promise(reportTopic({ topicId, type: reportType }), {
      loading: "Submitting report...",
      success: (res) => {
        if (res.success) return "Report submitted";
        else throw new Error(res.message);
      },
      error: "Failed to submit report",
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
          onClick={(event) => event.stopPropagation()}
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
            onClick={() => report(option.value)}
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

function TrendingTopicsSkeleton() {
  return (
    <div>
      <HeaderSkeleton className="mb-5" />
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className={cn("flex items-center justify-between", "p-2")}
            key={index}
          >
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="size-4 mr-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
