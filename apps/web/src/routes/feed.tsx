import { createFileRoute } from "@tanstack/react-router";
import RedditFeed from "@/components/RedditFeed";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

function FeedPage() {
  return (
    <div className="relative flex min-h-screen flex-col pt-24">
      <div className="mx-auto w-full max-w-7xl pt-8 pb-20">
        <RedditFeed />
      </div>
    </div>
  );
}

