"use client";

import type { HashtagDto } from "api";

import { useRefreshApi } from "@/components/providers";
import useSWRImmutable from "swr/immutable";
import { SWRFetcher } from "@/libraries/swr";
import { toast } from "sonner";
import { ApiUrl, SuggestApi } from "@/services";
import Format from "@/utilities/format";
import { ROUTE } from "@/constants/route";
import { TrendingReportType } from "@/constants/server";

import { cn } from "@/libraries/utils";
import Link from "next/link";
import { NumberTooltip } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SectionHeader from "./SectionHeader";
import {
  AlertCircle,
  Ban,
  Circle,
  Copy,
  MoreHorizontal,
} from "@/components/icons";

const FEEDBACK_OPTIONS = [
  {
    label: "The associated content is not relevant",
    icon: <Circle variant="x" className="mr-2 size-4" />,
    value: TrendingReportType.NOT_RELEVANT,
  },
  {
    label: "This trend is spam",
    icon: <AlertCircle className="mr-2 size-4" />,
    value: TrendingReportType.SPAM,
  },
  {
    label: "This trend is abusive or harmful",
    icon: <AlertCircle className="mr-2 size-4" />,
    value: TrendingReportType.ABUSIVE,
  },
  {
    label: "Not interested in this",
    icon: <Ban className="mr-2 size-4" />,
    value: TrendingReportType.NOT_INTERESTED,
  },
  {
    label: "This trend is a duplicate",
    icon: <Copy className="mr-2 size-4" />,
    value: TrendingReportType.DUPLICATE,
  },
  {
    label: "This trend is harmful or spammy",
    icon: <AlertCircle className="mr-2 size-4" />,
    value: TrendingReportType.HARMFUL,
  },
];

export default function TrendingTopics() {
  const { data, isLoading, error } = useSWRImmutable(
    ApiUrl.suggestion.trending,
    SWRFetcher<{ topics: HashtagDto[] }>
  );

  if (isLoading) return <TrendingTopicsSkeleton />;
  if (!data || data.topics.length === 0 || error) return null;
  return (
    <div className="w-full">
      <SectionHeader className="mb-4">Trending topics</SectionHeader>
      <div className="w-[calc(100%-4px)] mx-auto">
        {data.topics.map((topic) => (
          <TopicItem key={topic.name} topic={topic} />
        ))}
      </div>
    </div>
  );
}

function TopicItem({ topic }: Readonly<{ topic: HashtagDto }>) {
  return (
    <Link
      href={ROUTE.SEARCH(`#${topic.name}`)}
      className={cn(
        "w-full",
        "group/topic-item",
        "w-full p-2 rounded-md",
        "flex items-center justify-between gap-4",
        "hover:bg-accent/5 cursor-pointer",
        "transition-colors duration-150 ease-in-out",
        "focus-indicator"
      )}
    >
      <div className={cn("flex flex-col gap-1", "grow min-w-0 w-full")}>
        <span
          className={cn(
            "inline-block font-semibold text-sm",
            "group-hover/topic-item:underline",
            "truncate"
          )}
        >
          #{topic.name}
        </span>
        <NumberTooltip
          number={topic.count}
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <span className="text-xs text-muted-foreground w-fit">
            {Format.number(topic.count)} posts
          </span>
        </NumberTooltip>
      </div>
      <ReportButton topic={topic.name} className="shrink-0" />
    </Link>
  );
}

function ReportButton({
  topic,
  className,
}: Readonly<{ topic: HashtagDto["name"]; className?: string }>) {
  const reportTopic = useRefreshApi(SuggestApi.reportTopic);
  function report(reportType: TrendingReportType) {
    toast.promise(reportTopic({ topic, type: reportType }), {
      loading: "Submitting report...",
      success: ({ success, message }) => {
        if (success) return message || "Report submitted.";
        throw new Error(message);
      },
      error: (error) => error.message ?? "Failed to submit report.",
    });
  }

  return (
    <div onClick={(event) => event.preventDefault()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "rounded-full p-1 cursor-pointer",
              "hover:bg-primary/10 group/report-button",
              "transition-colors duration-150 ease-in-out",
              "focus-indicator",
              className
            )}
          >
            <MoreHorizontal
              className={cn(
                "size-4 text-muted-foreground",
                "group-hover/report-button:text-primary",
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
    </div>
  );
}

function TrendingTopicsSkeleton() {
  return (
    <div>
      <SectionHeader className="mb-5">Trending topics</SectionHeader>
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={cn("flex items-center justify-between", "p-2")}
          >
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-3 w-5 mr-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
