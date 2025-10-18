import { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type FeedPost = {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  upvotes: number;
  comments: number;
  createdAt: string; // ISO string
  imageUrl?: string;
  flair?: string;
  tokenPrice?: number; // in SOL
  marketCap?: number; // in SOL
  volume24h?: number; // in SOL
  isTrending?: boolean;
};

type FeedCardProps = {
  post: FeedPost;
  className?: string;
  onTrade?: (post: FeedPost) => void;
};

export default function FeedCard({ post, className, onTrade }: FeedCardProps) {
  const timeAgo = useMemo(() => {
    const diffMs = Date.now() - new Date(post.createdAt).getTime();
    const diffMin = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  }, [post.createdAt]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/20 bg-black/60 p-4 sm:p-5",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_20px_40px_-20px_rgba(0,0,0,0.6)]",
        "ring-1 ring-white/10 backdrop-blur-md",
        className,
      )}
    >
      {/* Glow accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{
          background:
            "radial-gradient(600px 200px at 10% 0%, rgba(239,68,68,0.18), rgba(0,0,0,0)), radial-gradient(600px 200px at 90% 100%, rgba(59,130,246,0.18), rgba(0,0,0,0))",
        }}
      />

      {/* Header */}
      <div className="relative z-10 mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-white/5 text-white/90">
            r/
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className="truncate">r/{post.subreddit}</span>
              <span className="opacity-40">•</span>
              <span className="truncate">u/{post.author}</span>
              <span className="opacity-40">•</span>
              <span>{timeAgo}</span>
            </div>
            <h3 className="mt-1 line-clamp-2 text-[0.98rem] font-semibold leading-snug text-white">
              {post.title}
            </h3>
          </div>
        </div>

        {post.flair ? (
          <span className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-white/70">
            {post.flair}
          </span>
        ) : null}
      </div>

      {/* Media */}
      {post.imageUrl ? (
        <div className="relative mb-4 overflow-hidden rounded-2xl border border-white/15">
          <motion.img
            src={post.imageUrl}
            alt="Post media"
            className="h-52 w-full object-cover sm:h-56"
            initial={{ scale: 1.02 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      ) : null}

      {/* Stats + Trade */}
      <div className="relative z-10 flex items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8rem] text-white/70">
          <span>⬆ {Intl.NumberFormat().format(post.upvotes)}</span>
          <span>💬 {Intl.NumberFormat().format(post.comments)}</span>
          {typeof post.tokenPrice === "number" && (
            <span className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-white/80">
              {post.tokenPrice.toFixed(3)} SOL
            </span>
          )}
          {typeof post.marketCap === "number" && (
            <span className="text-white/50">MC {Intl.NumberFormat().format(post.marketCap)} SOL</span>
          )}
          {typeof post.volume24h === "number" && (
            <span className="text-white/50">VOL 24h {Intl.NumberFormat().format(post.volume24h)} SOL</span>
          )}
        </div>

        <Button
          size="sm"
          className={cn(
            "relative overflow-hidden rounded-xl border border-white/20 bg-white/10 px-4 text-white",
            "transition-colors hover:bg-white/20",
          )}
          onClick={() => onTrade?.(post)}
        >
          <span className="relative z-10">Trade</span>
          <motion.span
            aria-hidden
            className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(200px 80px at 50% 100%, rgba(59,130,246,0.25), rgba(0,0,0,0))",
            }}
          />
        </Button>
      </div>
    </motion.article>
  );
}


