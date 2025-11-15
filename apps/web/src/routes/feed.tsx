import { createFileRoute } from "@tanstack/react-router";
import RedditFeed from "@/components/RedditFeed";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

function FeedPage() {
  return (
    <>
      <MobileNav currentPage="feed" />
      <DesktopSidebar currentPage="feed" />
      
      <div className="relative flex min-h-screen flex-col pt-20 sm:pt-24 md:pt-28 pb-20 md:pb-0">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 md:pl-32 lg:pl-36 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-16">
          <RedditFeed />
        </div>
      </div>
    </>
  );
}

