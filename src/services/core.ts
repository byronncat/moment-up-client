import { mockComments, mockFeed, mockMoments } from "@/__mocks__";
import type { FeedInfo, MomentInfo, CommentInfo } from "api";
import { SortBy } from "@/constants/clientConfig";
import { Audience } from "@/constants/serverConfig";

import type { Token } from "@/components/providers/Auth";
import type { API, ErrorResponse } from "api";
import { ApiUrl } from "./api.constant";

const apiRes = {
  getMoments: "success" as "error" | "empty" | "success",
  getMoment: "success" as "error" | "empty" | "success",
  getComments: "success" as "error" | "success" | "empty",
  getFeeds: "success" as "error" | "empty" | "success",
  explore: "success" as "error" | "empty" | "success",
  repost: "success" as "error" | "success",
  comment: "success" as "error" | "success",
  report: "success" as "error" | "success",
  toggleLike: "success" as "error" | "success",
  toggleBookmark: "success" as "error" | "success",
  toggleCommentLike: "success" as "error" | "success",
};

interface LikeDto {
  momentId: string;
  shouldLike: boolean;
}

interface BookmarkDto {
  momentId: string;
  shouldBookmark: boolean;
}

export async function like(data: LikeDto, token: Token): API {
  const endpoint = data.shouldLike
    ? ApiUrl.moment.like(data.momentId)
    : ApiUrl.moment.unlike(data.momentId);
  const method = data.shouldLike ? "POST" : "DELETE";
  const successMessage = data.shouldLike ? "Liked" : "Unliked";

  return await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: successMessage,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        statusCode: error.statusCode,
        success: false,
        message: error.message as string,
      };
    });
}

export async function bookmark(data: BookmarkDto, token: Token): API {
  const endpoint = data.shouldBookmark
    ? ApiUrl.moment.bookmark(data.momentId)
    : ApiUrl.moment.unbookmark(data.momentId);
  const method = data.shouldBookmark ? "POST" : "DELETE";
  const successMessage = data.shouldBookmark ? "Bookmarked" : "Unbookmarked";

  return await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: successMessage,
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        statusCode: error.statusCode,
        success: false,
        message: error.message as string,
      };
    });
}

export async function repost(
  data: {
    momentId: string;
    text: string;
    audience: Audience;
  },
  token: Token
): API {
  return await fetch(ApiUrl.moment.repost(data.momentId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token.csrfToken,
      Authorization: `Bearer ${token.accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      text: data.text,
      audience: data.audience,
    }),
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return {
        success: true,
        message: "Reposted successfully",
      };
    })
    .catch((error: ErrorResponse) => {
      return {
        statusCode: error.statusCode,
        success: false,
        message: error.message as string,
      };
    });
}

export async function getFeed(feedId: string): API<FeedInfo> {
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

export async function getMoment(momentId: string): API<MomentInfo | null> {
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
): API<{
  items: CommentInfo[];
  hasNextPage: boolean;
}> {
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
): API<{
  items: MomentInfo[];
  hasNextPage: boolean;
}> {
  console.log("explore", type, page);
  const filteredMoments =
    type === "media"
      ? mockMoments.filter(
          (moment) => moment.post.files && moment.post.files.length > 0
        )
      : mockMoments;
  const moments = filteredMoments;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  if (apiRes.explore === "error") {
    return {
      success: false,
      message: "error",
    };
  }

  if (apiRes.explore === "empty") {
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
      hasNextPage: page <= 5,
    },
  };
}

export async function comment(momentId: string, data: CommentInfo): API {
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

export async function toggleCommentLike(commentId: string): API {
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
