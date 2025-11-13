import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import FeedCard, { type FeedPost } from "@/components/FeedCard";
import TradingModal from "@/components/TradingModal";
import SearchBar, { type SearchFilters } from "@/components/SearchBar";
import { getApiUrl } from "@/lib/auth";
import { Button } from "@/components/ui/button";

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
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [isTradingModalOpen, setIsTradingModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  // Fetch posts from backend
  const fetchPosts = useCallback(async (showRefreshing = false, resetOffset = true, filters: SearchFilters = {}, currentOffset = 0) => {
      try {
        if (showRefreshing) {
          setIsRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);
        
        const useOffset = resetOffset ? 0 : currentOffset;
        
        const apiUrl = getApiUrl();
        
        // Build URL based on whether we're searching or browsing
        const hasSearchParams = filters.q || filters.subreddit || filters.author || filters.minPrice || filters.maxPrice || filters.minVolume || filters.minMarketCap || filters.tags;
        let url = hasSearchParams 
          ? `${apiUrl}/api/posts/search?`
          : `${apiUrl}/api/posts?status=all&`;
        
        // Add pagination
        url += `limit=20&offset=${useOffset}`;
        
        // Add filters
        if (filters.q) url += `&q=${encodeURIComponent(filters.q)}`;
        if (filters.subreddit) url += `&subreddit=${encodeURIComponent(filters.subreddit)}`;
        if (filters.author) url += `&author=${encodeURIComponent(filters.author)}`;
        if (filters.minPrice) url += `&minPrice=${filters.minPrice}`;
        if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
        if (filters.minVolume) url += `&minVolume=${filters.minVolume}`;
        if (filters.minMarketCap) url += `&minMarketCap=${filters.minMarketCap}`;
        if (filters.tags) url += `&tags=${encodeURIComponent(filters.tags)}`;
        if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
        
        // Fetch posts with filters
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await response.json();
        
        console.log("📦 Fetched posts from backend:", data.posts?.length || 0);
        console.log("📄 Pagination:", data.pagination);
        console.log("🔄 Has more:", data.hasMore);
        
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
          tokenSymbol: post.tokenSymbol,
          initialPrice: post.initialPrice,
          status: post.status,
          tokenMintAddress: post.tokenMintAddress,
          redditUrl: post.redditUrl,
          totalSupply: post.tokenSupply ? parseFloat(post.tokenSupply) : undefined,
          holders: post.holders || 0,
        }));
        
        console.log("✅ Transformed posts:", transformedPosts.length);
        
        // Update posts based on whether we're resetting or appending
        if (resetOffset) {
          setPosts(transformedPosts);
          setOffset(transformedPosts.length);
        } else {
          setPosts((prev) => [...prev, ...transformedPosts]);
          setOffset((prev) => prev + transformedPosts.length);
        }
        
        // Update hasMore flag
        setHasMore(data.hasMore || false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err.message : "Failed to load posts");
        // Don't set posts to empty, keep existing posts on error
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }, []); // Remove offset from dependencies

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      await fetchPosts(false, false, searchFilters, offset);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, fetchPosts, searchFilters, offset]);

  // Handle search
  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
    setIsSearching(Object.keys(filters).length > 0);
    setOffset(0);
    fetchPosts(false, true, filters, 0);
  }, [fetchPosts]);

  // Initial fetch
  useEffect(() => {
    fetchPosts(true, true, {}, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    setOffset(0);
    fetchPosts(true, true, searchFilters, 0);
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      // Load more when user is 300px from bottom
      if (scrollHeight - scrollTop - clientHeight < 300 && hasMore && !loadingMore) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loadMorePosts]);

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

  const handleTrade = (post: FeedPost) => {
    setSelectedPost(post);
    setIsTradingModalOpen(true);
  };

  return (
    <>
      <section id="feed" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} showFilters={true} />
      </div>

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
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                variant="ghost"
                size="sm"
                className="h-8 border border-white/10 bg-white/5 px-3 text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="ml-2 hidden sm:inline">
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </Button>
              
              {/* Tabs */}
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
      {error && !loading && posts.length === 0 && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-red-400">⚠️ {error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-2 text-sm text-white transition-colors hover:bg-white/10"
          >
            Try Again
          </button>
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
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <FeedCard key={post.id} post={post} onTrade={handleTrade} />
            ))}
          </div>

          {/* Load More Indicator */}
          {loadingMore && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                <span className="text-sm text-white/70">Loading more posts...</span>
              </div>
            </div>
          )}

          {/* End of Results */}
          {!hasMore && !loadingMore && (
            <div className="mt-8 text-center">
              <p className="text-sm text-white/50">
                🎉 You've reached the end! No more posts to load.
              </p>
            </div>
          )}
        </>
      )}
      </section>

      {/* Trading Modal */}
      {selectedPost && (
        <TradingModal
          post={selectedPost}
          isOpen={isTradingModalOpen}
          onClose={() => {
            setIsTradingModalOpen(false);
            setSelectedPost(null);
          }}
        />
      )}
    </>
  );
}


