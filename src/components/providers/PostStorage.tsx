"use client";

// === Type ===
import type { FeedItemDto } from "api";
import type { ContentReportType } from "@/constants/server";

type PostsState = Map<string, FeedItemDto> | undefined;

type PostsAction =
  | { type: "SET_POSTS"; payload: FeedItemDto[] }
  | { type: "ADD_POSTS"; payload: FeedItemDto[] }
  | { type: "REMOVE_POST"; payload: string }
  | { type: "TOGGLE_LIKE"; payload: string }
  | { type: "TOGGLE_BOOKMARK"; payload: string }
  | { type: "TOGGLE_FOLLOW"; payload: string };

type PostContextType = {
  posts: FeedItemDto[] | undefined;
  setPosts: (posts: FeedItemDto[]) => void;
  addPosts: (posts: FeedItemDto[]) => void;
  removeMoment: (postId: string) => void;
  setCurrentPost: (postId: string) => void;
  getCurrentPost: () => FeedItemDto | undefined;

  like: (postId: string) => Promise<void>;
  bookmark: (postId: string) => Promise<void>;
  share: (postId: string) => void;
  report: (postId: string, type: ContentReportType) => void;
  follow: (postId: string) => Promise<void>;
};

// === Provider ===
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import { toast } from "sonner";
import { CoreApi, UserApi } from "@/services";
import { Link } from "@/components/icons";
import { useRefreshApi } from "./hooks/useRefreshApi";

const initialPostsState: PostsState = undefined;

function postsReducer(state: PostsState, action: PostsAction): PostsState {
  switch (action.type) {
    case "SET_POSTS": {
      const newMap = new Map<string, FeedItemDto>();
      action.payload.forEach((post) => {
        newMap.set(post.id, post);
      });
      return newMap;
    }

    case "ADD_POSTS": {
      if (action.payload.length > 0) {
        const newMap = new Map(state);
        action.payload.forEach((post) => {
          newMap.set(post.id, post);
        });
        return newMap;
      }
      return state;
    }

    case "REMOVE_POST": {
      if (!state) return state;
      const newMap = new Map(state);
      newMap.delete(action.payload);
      return newMap;
    }

    case "TOGGLE_LIKE": {
      if (!state) return state;
      const newMap = new Map(state);
      const feed = newMap.get(action.payload);
      if (feed) {
        newMap.set(action.payload, {
          ...feed,
          post: {
            ...feed.post,
            isLiked: !feed.post.isLiked,
            likes: feed.post.isLiked
              ? feed.post.likes - 1
              : feed.post.likes + 1,
          },
        });
      }
      return newMap;
    }

    case "TOGGLE_BOOKMARK": {
      if (!state) return state;
      const newMap = new Map(state);
      const feed = newMap.get(action.payload);
      if (feed) {
        newMap.set(action.payload, {
          ...feed,
          post: {
            ...feed.post,
            isBookmarked: !feed.post.isBookmarked,
          },
        });
      }
      return newMap;
    }

    case "TOGGLE_FOLLOW": {
      if (!state) return state;
      const newMap = new Map(state);
      const feed = newMap.get(action.payload);
      if (feed) {
        newMap.set(action.payload, {
          ...feed,
          user: {
            ...feed.user,
            isFollowing: !feed.user.isFollowing,
          },
        });
      }
      return newMap;
    }

    default:
      return state;
  }
}

export type Actions = {
  like: (postId: FeedItemDto["id"]) => Promise<void>;
  bookmark: (postId: FeedItemDto["id"]) => Promise<void>;
  share: (postId: FeedItemDto["id"]) => void;
  report: (postId: FeedItemDto["id"], type: ContentReportType) => void;
  follow: (postId: FeedItemDto["id"]) => Promise<void>;
};

const MomentDataContext = createContext<PostContextType>({
  posts: undefined,
  setPosts: () => {},
  addPosts: () => {},
  removeMoment: () => {},
  setCurrentPost: () => {},
  getCurrentPost: () => undefined,

  like: async () => {},
  bookmark: async () => {},
  share: () => {},
  report: () => {},
  follow: async () => {},
});

export const usePost = () => useContext(MomentDataContext);

type MomentDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MomentDataProvider({
  children,
}: MomentDataProviderProps) {
  const [posts, dispatch] = useReducer(postsReducer, initialPostsState);
  const [currentPost, setCurrentPost] = useState<string | null>(null);

  const likeApi = useRefreshApi(CoreApi.likePost);
  const bookmarkApi = useRefreshApi(CoreApi.bookmarkPost);
  const reportApi = useRefreshApi(CoreApi.reportPost);
  const followApi = useRefreshApi(UserApi.follow);

  const getCurrentPost = useCallback(() => {
    if (!posts) return undefined;
    return currentPost ? posts.get(currentPost) : posts.values().next().value;
  }, [posts, currentPost]);

  const setPosts = useCallback((payload: FeedItemDto[]) => {
    dispatch({ type: "SET_POSTS", payload });
  }, []);

  const addPosts = useCallback((moments: FeedItemDto[]) => {
    dispatch({ type: "ADD_POSTS", payload: moments });
  }, []);

  const removeMoment = useCallback((postId: string) => {
    dispatch({ type: "REMOVE_POST", payload: postId });
  }, []);

  const like = useCallback(
    async (postId: string) => {
      const post = posts?.get(postId);
      if (!post) return;

      const shouldLike = !post.post.isLiked;
      dispatch({ type: "TOGGLE_LIKE", payload: postId });

      const { success, message } = await likeApi({
        postId,
        shouldLike,
      });

      if (!success) {
        dispatch({ type: "TOGGLE_LIKE", payload: postId });
        toast.error(message || "Failed to like moment");
      }
    },
    [posts, likeApi]
  );

  const bookmark = useCallback(
    async (postId: string) => {
      const moment = posts?.get(postId);
      if (!moment) return;

      const shouldBookmark = !moment.post.isBookmarked;
      dispatch({ type: "TOGGLE_BOOKMARK", payload: postId });

      const { success, message } = await bookmarkApi({
        postId,
        shouldBookmark,
      });

      if (!success) {
        dispatch({ type: "TOGGLE_BOOKMARK", payload: postId });
        toast.error(message || "Failed to bookmark moment");
      }
    },
    [posts, bookmarkApi]
  );

  const follow = useCallback(
    async (postId: string) => {
      const moment = posts?.get(postId);
      if (!moment) return;

      const shouldFollow = !moment.user.isFollowing;
      dispatch({ type: "TOGGLE_FOLLOW", payload: postId });

      const { success, message } = await followApi({
        targetId: moment.user.id,
        shouldFollow,
      });

      if (!success) {
        dispatch({ type: "TOGGLE_FOLLOW", payload: postId });
        toast.error(message || "Failed to follow/unfollow user");
      }
    },
    [posts, followApi]
  );

  const share = useCallback((postId: string) => {
    const url = window.location.href;
    const { origin } = new URL(url);
    navigator.clipboard.writeText(`${origin}/moment/${postId}`);
    toast(
      <div className="flex items-center gap-2">
        <Link size={16} />
        <p>Copied to clipboard</p>
      </div>
    );
  }, []);

  const report = useCallback(
    (postId: string, type: ContentReportType) => {
      toast.promise(reportApi(postId, { type }), {
        loading: "Reporting...",
        success: ({ success, message }) => {
          if (success) return "Reported";
          throw new Error(message);
        },
        error: ({ message }) => message,
      });
    },
    [reportApi]
  );

  const contextValue = useMemo(
    () => ({
      posts: posts ? Array.from(posts.values()) : undefined,
      setPosts,
      addPosts,
      removeMoment,
      getCurrentPost,
      setCurrentPost,

      like,
      bookmark,
      share,
      report,
      follow,
    }),
    [
      posts,
      setPosts,
      addPosts,
      removeMoment,
      getCurrentPost,
      setCurrentPost,
      like,
      bookmark,
      share,
      follow,
      report,
    ]
  );

  return (
    <MomentDataContext.Provider value={contextValue}>
      {children}
    </MomentDataContext.Provider>
  );
}
