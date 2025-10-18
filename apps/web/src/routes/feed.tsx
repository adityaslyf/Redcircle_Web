import { createFileRoute } from "@tanstack/react-router";
import RedditFeed from "@/components/RedditFeed";
import { SplashCursor } from "@/components/ui/splash-cursor";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

function FeedPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SplashCursor />
      <div className="mx-auto w-full max-w-7xl pt-28 pb-20">
        <RedditFeed />
      </div>
    </div>
  );
}

