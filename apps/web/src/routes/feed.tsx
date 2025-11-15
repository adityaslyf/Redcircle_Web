import { createFileRoute } from "@tanstack/react-router";
import RedditFeed from "@/components/RedditFeed";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

function FeedPage() {
  return (
    <div className="relative flex min-h-screen flex-col pt-20 sm:pt-24 md:pt-28">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-20">
        <RedditFeed />
      </div>
    </div>
  );
}

