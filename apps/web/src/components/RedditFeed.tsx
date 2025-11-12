import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import FeedCard, { type FeedPost } from "@/components/FeedCard";
import { getApiUrl } from "@/lib/auth";

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

// Backend post type (matches database schema)
type BackendPost = {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  upvotes: number;
  comments: number;
  tokenizedAt: string;
  redditCreatedAt?: string;
  thumbnail?: string; // Database field name
  tags?: string[];
  currentPrice?: string;
  marketCap?: string;
  totalVolume?: string; // Database field name
  featured: number;
};

export default function RedditFeed({ sideFilters = false }: { sideFilters?: boolean }) {
  const [active, setActive] = useState<TabKey>("all");
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = getApiUrl();
        // Fetch all posts including pending ones (status=all)
        const response = await fetch(`${apiUrl}/api/posts?status=all&limit=100`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await response.json();
        
        console.log("📦 Fetched posts from backend:", data.posts?.length || 0);
        if (data.posts?.length > 0) {
          console.log("📝 First post:", data.posts[0]);
        }
        
        // Transform backend data to FeedPost format
        const transformedPosts: FeedPost[] = (data.posts || []).map((post: BackendPost) => ({
          id: post.id,
          title: post.title,
          subreddit: post.subreddit,
          author: post.author,
          upvotes: post.upvotes || 0,
          comments: post.comments || 0,
          createdAt: post.tokenizedAt,
          imageUrl: post.thumbnail || undefined,
          flair: post.tags && post.tags.length > 0 ? post.tags[0] : undefined,
          tokenPrice: post.currentPrice ? parseFloat(post.currentPrice) : undefined,
          marketCap: post.marketCap ? parseFloat(post.marketCap) : undefined,
          volume24h: post.totalVolume ? parseFloat(post.totalVolume) : undefined,
          isTrending: post.featured > 0,
        }));
        
        console.log("✅ Transformed posts:", transformedPosts.length);
        setPosts(transformedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err.message : "Failed to load posts");
        // Fallback to mock data if API fails
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

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
      {sideFilters ? (
        <aside className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
          <h3 className="mb-2 pl-1 text-xs uppercase tracking-wider text-white/50">Feed</h3>
          {TABS.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={
                  "rounded-xl border px-3 py-2 text-sm transition-colors " +
                  (isActive
                    ? "border-white/20 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")
                }
              >
                {t.label}
              </button>
            );
          })}
        </aside>
      ) : (
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
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-red-400">⚠️ {error}</p>
          <p className="mt-2 text-sm text-white/50">Showing mock data for now</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-xl text-white/70">📭 No tokenized posts yet</p>
          <p className="mt-2 text-sm text-white/50">
            Be the first to tokenize a Reddit post!
          </p>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}


