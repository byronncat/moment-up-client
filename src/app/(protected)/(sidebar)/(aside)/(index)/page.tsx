import { VirtualizedFeed } from "./_components";
import { HomeFeedProvider } from "./_providers/HomeFeed";

export default function HomePage() {
  return (
    <HomeFeedProvider>
      <VirtualizedFeed />
    </HomeFeedProvider>
  );
}
