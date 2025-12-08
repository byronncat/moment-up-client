import { Feed } from "./_components";
import { HomeFeedProvider } from "./_providers/HomeFeed";

export default function HomePage() {
  return (
    <HomeFeedProvider>
      <Feed />
    </HomeFeedProvider>
  );
}
