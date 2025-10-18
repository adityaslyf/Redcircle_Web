import { useMemo, useState } from "react";
import { motion } from "motion/react";
import FeedCard, { type FeedPost } from "@/components/FeedCard";

const MOCK_POSTS: FeedPost[] = [
  {
    id: "1",
    title: "I built a bot that analyzes sentiment of crypto subreddits in real-time",
    subreddit: "CryptoCurrency",
    author: "quantum_builder",
    upvotes: 18420,
    comments: 1023,
    createdAt: new Date(Date.now() - 1000 * 60 * 37).toISOString(),
    imageUrl:
      "https://images.unsplash.com/photo-1640340434858-886b2a2e4fcc?q=80&w=1600&auto=format&fit=crop",
    flair: "Project",
    tokenPrice: 0.128,
    marketCap: 425_000,
    volume24h: 62_310,
    isTrending: true,
  },
  {
    id: "2",
    title: "This UI pattern feels so satisfying on mobile",
    subreddit: "reactjs",
    author: "uimotion",
    upvotes: 9320,
    comments: 404,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    flair: "Showcase",
    tokenPrice: 0.072,
    marketCap: 122_000,
    volume24h: 18_940,
  },
  {
    id: "3",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
    flair: "Discussion",
    tokenPrice: 0.054,
    marketCap: 86_000,
    volume24h: 9_120,
  },
  {
    id: "4",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
    flair: "Discussion",
    tokenPrice: 0.054,

    marketCap: 86_000,
    volume24h: 9_120,
  },
  {
    id: "5",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
    flair: "Discussion",
    tokenPrice: 0.054,
    marketCap: 86_000,
    volume24h: 9_120,
  },
  {
    id: "6",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
    flair: "Discussion",
    tokenPrice: 0.054,
    marketCap: 86_000,
    volume24h: 9_120,
  },
  {
    id: "7",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
    flair: "Discussion",
    tokenPrice: 0.054,
    marketCap: 86_000,
    volume24h: 9_120,
  },
  {
    id: "8",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
  },
  {
    id: "9",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
  },
  {
    id: "10",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
  },
  {
    id: "11",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
  },
  {
    id: "12",
    title: "Ask HN: What made your side project take off?",
    subreddit: "Entrepreneur",
    author: "growthloop",
    upvotes: 14210,
    comments: 857,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
  },
];

type TabKey = "all" | "trending" | "new" | "terminal";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "trending", label: "Trending" },
  { key: "new", label: "New" },
  { key: "terminal", label: "Terminal" },
];

export default function RedditFeed() {
  const [active, setActive] = useState<TabKey>("all");
  const posts = useMemo(() => MOCK_POSTS, []);

  const filtered = useMemo(() => {
    switch (active) {
      case "trending":
        return posts.filter((p) => p.isTrending || (p.upvotes ?? 0) > 10000);
      case "new":
        return [...posts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "terminal":
        // Placeholder: In future, filter posts tagged as terminal/tradable-only
        return posts.slice(0, Math.max(1, Math.floor(posts.length / 2)));
      default:
        return posts;
    }
  }, [active, posts]);

  return (
    <section id="feed" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Sticky header */}
      <div className="z-40 mb-6 border-b border-white/10 bg-black/80 py-3 backdrop-blur supports-[backdrop-filter]:bg-black/60 sm:top-24 sm:mb-8">
        <div className="flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-lg font-semibold text-white sm:text-xl"
          >
            Feed
          </motion.h2>
          <nav className="relative">
            <ul className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1 text-sm text-white/80">
              {TABS.map((t) => {
                const isActive = active === t.key;
                return (
                  <li key={t.key}>
                    <button
                      onClick={() => setActive(t.key)}
                      className={
                        "relative rounded-lg px-3 py-1 transition-colors" +
                        (isActive ? " bg-white/15 text-white" : " hover:bg-white/10")
                      }
                    >
                      {t.label}
                      {isActive && (
                        <motion.span
                          layoutId="tab-underline"
                          className="absolute inset-0 -z-10 rounded-lg border border-white/15"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}


