import { useMemo } from "react";
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

export default function RedditFeed() {
  const posts = useMemo(() => MOCK_POSTS, []);

  return (
    <section id="feed" className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="mb-8 sm:mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-1797 uppercase text-2xl text-white sm:text-3xl"
        >
          Live Tradeable Feed
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-2 max-w-2xl text-sm text-white/70"
        >
          Tokenize high-signal Reddit posts. Trade momentum. Earn the upside.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}


