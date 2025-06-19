import { mockComments, mockFeed, mockFeeds, mockMoments } from "@/__mocks__";
import type {
  API,
  FeedInfo,
  FeedNotification,
  DetailedMomentInfo,
  CommentInfo,
} from "api";
import { PAGE_CONFIG, Audience, SortBy } from "@/constants/clientConfig";

const apiRes = {
  getMoments: "success" as "error" | "empty" | "success",
  getMoment: "success" as "error" | "empty" | "success",
  getComments: "success" as "error" | "success" | "empty",
  getFeeds: "success" as "error" | "empty" | "success",
  repost: "success" as "error" | "success",
  comment: "success" as "error" | "success",
  report: "success" as "error" | "success",
  toggleLike: "success" as "error" | "success",
  toggleBookmark: "success" as "error" | "success",
  toggleCommentLike: "success" as "error" | "success",
};

export async function getFeeds(): Promise<API<FeedNotification[]>> {
  console.log("getFeeds");
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });

  if (apiRes.getFeeds === "error") {
    return {
      success: false,
      message: "error",
    };
  }

  if (apiRes.getFeeds === "empty") {
    return {
      success: true,
      message: "ok",
      data: [],
    };
  }

  return {
    success: true,
    message: "ok",
    data: mockFeeds,
  };
}

export async function getFeed(feedId: string): Promise<API<FeedInfo>> {
  console.log("getFeed", feedId);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Make sure mockFeed array exists and has elements
      if (!Array.isArray(mockFeed) || mockFeed.length === 0) {
        resolve({
          success: false,
          message: "Feed data not available",
          data: undefined,
        });
        return;
      }

      // Find the feed with the matching ID, or default to the first feed if not found
      const feed = mockFeed[0];

      resolve({
        success: true,
        message: "ok",
        data: feed,
      });
    }, 1000);
  });
}

export async function getMoments(page: number): Promise<
  API<{
    items: DetailedMomentInfo[];
    hasNextPage: boolean;
  }>
> {
  const start = (page - 1) * PAGE_CONFIG.MOMENT_CARD_PAGE;
  const end = start + PAGE_CONFIG.MOMENT_CARD_PAGE;
  const moments = mockMoments.slice(start, end);

  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (apiRes.getMoments === "error") {
    return {
      success: false,
      message: "error",
    };
  }
  if (apiRes.getMoments === "empty") {
    return {
      success: true,
      message: "ok",
      data: {
        items: [],
        hasNextPage: false,
      },
    };
  }
  return {
    success: true,
    message: "ok",
    data: {
      items: moments,
      hasNextPage: mockMoments.length > PAGE_CONFIG.MOMENT_CARD_PAGE * page,
    },
  };
}

export async function getMoment(
  momentId: string
): Promise<API<DetailedMomentInfo | null>> {
  console.log("getMoment", momentId);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (apiRes.getMoment === "error") {
    return {
      success: false,
      message: "Something went wrong",
      data: undefined,
    };
  }
  if (apiRes.getMoment === "empty") {
    return {
      success: false,
      message: "Moment not found",
      data: null,
    };
  }
  return {
    success: true,
    message: "ok",
    data: mockMoments.find((moment) => moment.id === momentId),
  };
}

export async function getComments(
  momentId: string,
  page: number,
  sortBy: SortBy
): Promise<
  API<{
    items: CommentInfo[];
    hasNextPage: boolean;
  }>
> {
  console.log("getComments", momentId, page, sortBy);
  const comments = mockComments.sort((a, b) => {
    if (sortBy === SortBy.NEWEST) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.likes - a.likes;
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (apiRes.getComments === "empty") {
    return {
      success: true,
      message: "ok",
      data: {
        items: [],
        hasNextPage: false,
      },
    };
  }

  if (apiRes.getComments === "error") {
    return {
      success: false,
      message: "error",
    };
  }

  return {
    success: true,
    message: "ok",
    data: {
      items: comments.map((comment) => ({
        ...comment,
        id: `${comment.id}-${page}`,
      })),
      hasNextPage: page <= 3,
    },
  };
}

export async function explore(
  type: "media" | "moments",
  page: number
): Promise<API<DetailedMomentInfo[]>> {
  console.log("explore", type, page);
  const start =
    (page - 1) *
    (type === "media"
      ? PAGE_CONFIG.MOMENT_CELL_PAGE
      : PAGE_CONFIG.MOMENT_CARD_PAGE);
  const end =
    start +
    (type === "media"
      ? PAGE_CONFIG.MOMENT_CELL_PAGE
      : PAGE_CONFIG.MOMENT_CARD_PAGE);
  const filteredMoments =
    type === "media"
      ? mockMoments.filter(
          (moment) => moment.post.files && moment.post.files.length > 0
        )
      : mockMoments;
  const moments = filteredMoments.slice(start, end);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "ok",
        data: moments,
      });
    }, 1000);
  });
}

export async function comment(
  momentId: string,
  data: CommentInfo
): Promise<API> {
  console.log("comment", momentId, data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.comment === "error") {
    return {
      success: false,
      message: "error",
    };
  }

  return {
    success: true,
    message: "ok",
  };
}

export async function repost(
  momentId: string,
  data: {
    comment: string;
    audience: `${Audience}`;
  }
): Promise<API> {
  console.log("Repost feature is not implemented yet", momentId, data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.repost === "error") {
    return {
      success: false,
      message: "error",
    };
  }

  return {
    success: true,
    message: "ok",
  };
}

export async function report(momentId: string) {
  console.log("Report feature is not implemented yet", momentId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.report === "error") {
    return {
      success: false,
      message: "error",
    };
  }

  return {
    success: true,
    message: "ok",
  };
}

export async function toggleLike(momentId: string): Promise<API> {
  console.log("Like feature is not implemented yet", momentId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.toggleLike === "error") {
    return {
      success: false,
      message: "error",
    };
  }
  return {
    success: true,
    message: "ok",
  };
}

export async function toggleBookmark(momentId: string): Promise<API> {
  console.log("Bookmark feature is not implemented yet", momentId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.toggleBookmark === "error") {
    return {
      success: false,
      message: "error",
    };
  }

  return {
    success: true,
    message: "ok",
  };
}

export async function toggleCommentLike(commentId: string): Promise<API> {
  console.log("Comment like feature is not implemented yet", commentId);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (apiRes.toggleCommentLike === "error") {
    return {
      success: false,
      message: "error",
    };
  }

  return {
    success: true,
    message: "ok",
  };
}
