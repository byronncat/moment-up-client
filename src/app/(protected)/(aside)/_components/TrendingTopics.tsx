"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SuggestingApi } from "@/services";
import { TrendingTopic } from "@/services/suggesting";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/components/icons";
import { ROUTE } from "@/constants/clientConfig";

export default function TrendingSection() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingTopics() {
      try {
        const response = await SuggestingApi.getTrendingTopics();
        if (response.success && response.data) {
          setTopics(response.data);
        } else {
          toast.error(response.message || "Failed to load trending topics");
        }
      } catch (error) {
        toast.error("An error occurred while fetching trending topics");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingTopics();
  }, []);

  function formatPostCount(count: number): string {
    return count.toLocaleString();
  }

  if (isLoading) {
    return (
      <div className="w-full mb-8 space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-md bg-accent/25"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-foreground">
          What's happening
        </span>
      </div>
      <div className="space-y-1">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={cn(
              "w-full py-3 px-4 rounded-md",
              "hover:bg-accent/30 cursor-pointer",
              "transition-colors duration-150 ease-in-out"
            )}
          >
            {topic.avatar ? (
              <div className="flex items-center gap-3 mb-1">
                <Avatar className="size-10">
                  <AvatarImage
                    src={topic.avatar}
                    alt={topic.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary">
                    <User className="size-4 fill-card" type="solid" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{topic.name}</span>
                    {topic.isLive && (
                      <span className="text-xs px-1.5 py-0.5 h-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-sm">
                        LIVE
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {topic.category}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {topic.category}
                  </span>
                  <button
                    className={cn(
                      "rounded-full p-1",
                      "hover:bg-accent/40",
                      "transition-colors duration-150 ease-in-out"
                    )}
                  >
                    <MoreHorizontal className="size-4 text-muted-foreground" />
                  </button>
                </div>
                <Link
                  href={ROUTE.SEARCH(topic.name)}
                  className="block font-semibold text-sm hover:underline"
                >
                  {topic.name}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {formatPostCount(topic.posts)} posts
                </span>
              </>
            )}
          </div>
        ))}
      </div>
      <button
        className={cn(
          "mt-4 text-sm text-primary font-medium w-full text-left px-4 py-3 rounded-md",
          "hover:bg-accent/30",
          "transition-colors duration-150 ease-in-out"
        )}
      >
        Show more
      </button>
    </div>
  );
}
