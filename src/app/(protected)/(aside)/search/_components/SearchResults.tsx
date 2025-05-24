import type { SearchResult } from "api";
import { SEARCH_CATEGORY } from "@/constants/clientConfig";

import { cn } from "@/libraries/utils";
import { SearchItem } from "../../_components";
import { ErrorContent } from "@/components";
import { MomentCard, MomentCell } from "@/components/moment";
import LoadingIndicator from "./LoadingIndicator";

type SearchResultsProps = Readonly<{
  results: SearchResult | null;
  type: SEARCH_CATEGORY;
  loading: boolean;
  errorHandler: () => void;
}>;

const ItemStyles = cn(
  "flex items-center justify-between",
  "group",
  "px-4 py-2",
  "cursor-pointer hover:bg-accent/[.05]"
);

function UserList({ users }: { users: SearchResult["users"] }) {
  if (!users?.length) return null;
  return (
    <div className="space-y-1 pb-10">
      {users.map((user) => (
        <div key={user.id} className={ItemStyles}>
          <SearchItem data={{ ...user, type: "user" }} />
        </div>
      ))}
    </div>
  );
}

function HashtagList({ hashtags }: { hashtags: SearchResult["hashtags"] }) {
  if (!hashtags?.length) return null;
  return (
    <div className="space-y-1 pb-10">
      {hashtags.map((hashtag) => (
        <div key={hashtag.id} className={ItemStyles}>
          <SearchItem data={{ ...hashtag, type: "hashtag" }} />
        </div>
      ))}
    </div>
  );
}

function PostList({ posts }: { posts: SearchResult["posts"] }) {
  if (!posts?.length) return null;
  return (
    <div className="space-y-4 px-4 pt-4 pb-10">
      {posts.map((post) => (
        <MomentCard key={post.id} data={post} />
      ))}
    </div>
  );
}

function MediaGrid({ posts }: { posts: SearchResult["posts"] }) {
  if (!posts?.length) return null;
  return (
    <div className={cn("grid grid-cols-3", "gap-1 px-1 pt-1 pb-10")}>
      {posts.map((post) => (
        <MomentCell key={post.id} data={post} />
      ))}
    </div>
  );
}

function Header({ title }: Readonly<{ title: string }>) {
  return (
    <div className={cn("flex justify-between items-center", "mb-2 px-4")}>
      <h2 className="font-semibold">{title}</h2>
    </div>
  );
}

function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="mt-[calc(2.75rem+1px)]">{children}</div>;
}

function CategoryResults({ type, results }: Readonly<{ type: SEARCH_CATEGORY; results: SearchResult }>) {
  const { users, posts, hashtags } = results;

  switch (type) {
    case SEARCH_CATEGORY.PEOPLE:
      return <UserList users={users} />;
    case SEARCH_CATEGORY.HASHTAG:
      return <HashtagList hashtags={hashtags} />;
    case SEARCH_CATEGORY.POSTS:
      return <PostList posts={posts} />;
    case SEARCH_CATEGORY.MEDIA:
      return <MediaGrid posts={posts} />;
    default:
      return (
        <div className="space-y-4">
          <div>
            <Header title="People" />
            <UserList users={users} />
          </div>
          <div>
            <Header title="Trending" />
            <HashtagList hashtags={hashtags} />
          </div>
          <div>
            <Header title="Posts" />
            <PostList posts={posts} />
          </div>
        </div>
      );
  }
}

export default function SearchResults({
  results,
  type,
  loading,
  errorHandler,
}: SearchResultsProps) {
  if (loading) 
    return (
      <Wrapper>
        <LoadingIndicator />
      </Wrapper>
    );
  
  if (results === null) 
    return <ErrorContent onRefresh={errorHandler} className="h-fit py-6" />;

  return (
    <Wrapper>
      <CategoryResults type={type} results={results} />
    </Wrapper>
  );
}
