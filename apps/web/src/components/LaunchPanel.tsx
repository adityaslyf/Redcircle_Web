import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Coins, Users, Sparkles, ExternalLink, AlertCircle } from "lucide-react";
import { getApiUrl } from "@/lib/auth";

interface RedditPostPreview {
  redditPostId: string;
  title: string;
  author: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  thumbnail?: string;
  url: string;
  content?: string;
  createdAt: string;
  age: string;
}

export default function LaunchPanel() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [postPreview, setPostPreview] = useState<RedditPostPreview | null>(null);
  const [error, setError] = useState("");
  
  // Token configuration
  const [initialSupply, setInitialSupply] = useState("10000");
  const [initialPrice, setInitialPrice] = useState("0.001");
  const [description, setDescription] = useState("");
  
  const [isSubmitting, setSubmitting] = useState(false);

  const handleFetchPost = async () => {
    if (!url) return;
    
    setError("");
    setIsFetching(true);
    
    try {
      const apiUrl = getApiUrl();
      console.log("🔍 Fetching post from:", `${apiUrl}/api/posts/fetch-reddit`);
      
      const response = await fetch(`${apiUrl}/api/posts/fetch-reddit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch Reddit post");
      }

      if (data.success && data.post) {
        setPostPreview(data.post);
        console.log("✅ Post fetched successfully:", data.post.title);
      } else {
        throw new Error("Invalid response from server");
      }
      
    } catch (err) {
      console.error("❌ Error fetching post:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch post");
      setPostPreview(null);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postPreview) {
      setError("Please fetch post details first");
      return;
    }

    if (!user?.id) {
      setError("You must be signed in to tokenize posts");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      const apiUrl = getApiUrl();
      console.log("🪙 Tokenizing post:", postPreview.title);
      
      const response = await fetch(`${apiUrl}/api/posts/tokenize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          tokenSupply: parseInt(initialSupply),
          initialPrice: parseFloat(initialPrice),
          description: description || null,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to tokenize post");
      }

      if (data.success && data.post) {
        const blockchainInfo = data.blockchain 
          ? `\n\n🔗 Blockchain Details:\n` +
            `Mint Address: ${data.blockchain.mintAddress}\n` +
            `Transaction: ${data.blockchain.transactionSignature.substring(0, 8)}...\n` +
            `\n📊 View on Solscan: ${data.blockchain.explorerUrl}`
          : '';

        alert(
          `🎉 Token Minted on Solana!\n\n` +
          `✅ ${data.message}\n\n` +
          `Token Symbol: ${data.post.tokenSymbol}\n` +
          `Supply: ${initialSupply} tokens\n` +
          `Initial Price: ${initialPrice} SOL\n` +
          `Market Cap: ${data.post.marketCap} SOL\n` +
          `Status: ${data.post.status}` +
          blockchainInfo
        );
        
        // Reset form
        setUrl("");
        setPostPreview(null);
        setInitialSupply("10000");
        setInitialPrice("0.001");
        setDescription("");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to tokenize post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-purple-400" />
          Tokenize a Reddit Post
        </h2>
        <p className="text-white/60 text-sm sm:text-base">
          Submit a Reddit post and create tradable tokens backed by its momentum
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Fetch Post */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-white">Reddit Post URL</h3>
          </div>
          
          <div className="space-y-3">
            <input
              required
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setPostPreview(null);
                setError("");
              }}
              placeholder="https://reddit.com/r/subreddit/comments/... or https://redd.it/..."
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-white/40 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            
            <Button
              type="button"
              onClick={handleFetchPost}
              disabled={!url || isFetching}
              className="w-full sm:w-auto rounded-2xl border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-purple-300 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isFetching ? (
                <>
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2" />
                  Fetching...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Fetch Post Details
                </>
              )}
            </Button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Step 2: Post Preview */}
        {postPreview && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-white">Post Preview</h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div className="flex gap-4">
                {postPreview.thumbnail && (
                  <img
                    src={postPreview.thumbnail}
                    alt="Post thumbnail"
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {postPreview.title}
                  </h4>
                  <p className="text-white/60 text-sm mb-3">
                    {postPreview.subreddit} • Posted by {postPreview.author}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-orange-400">
                      <TrendingUp className="w-4 h-4" />
                      {postPreview.upvotes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <Users className="w-4 h-4" />
                      {postPreview.comments} comments
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Token Configuration */}
        {postPreview && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-white">Token Configuration</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm text-white/70 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Initial Supply
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={initialSupply}
                  onChange={(e) => setInitialSupply(e.target.value)}
                  placeholder="10000"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
                <p className="mt-1 text-xs text-white/50">Total tokens available for trading</p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Initial Price (SOL)
                </label>
                <input
                  type="number"
                  required
                  min="0.0001"
                  step="0.0001"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(e.target.value)}
                  placeholder="0.001"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
                <p className="mt-1 text-xs text-white/50">Starting price per token</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-white/70">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context or why this post will moon..."
                rows={3}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
              />
            </div>

            {/* Token Economics Preview */}
            <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
              <h4 className="text-sm font-semibold text-green-400 mb-3">Token Economics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/50">Market Cap</p>
                  <p className="text-white font-semibold">
                    {(parseFloat(initialSupply || "0") * parseFloat(initialPrice || "0")).toFixed(4)} SOL
                  </p>
                </div>
                <div>
                  <p className="text-white/50">Your Wallet</p>
                  <p className="text-white font-semibold">{user?.walletAddress || "Not connected"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        {postPreview && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-end gap-4"
          >
            <Button
              type="button"
              onClick={() => {
                setUrl("");
                setPostPreview(null);
                setError("");
              }}
              className="rounded-2xl border border-white/20 bg-white/5 px-6 py-6 text-white/70 hover:bg-white/10 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
                className="rounded-2xl border border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-8 py-6 text-white font-semibold hover:from-purple-500/30 hover:to-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20 z-10000 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Tokenizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Launch Token
                </>
              )}
            </Button>
          </motion.div>
        )}
      </form>

      {/* Info Box */}
      {!postPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-sm text-blue-300/80"
        >
          <h4 className="font-semibold text-blue-400 mb-2">💡 How it works</h4>
          <ul className="space-y-1 list-disc list-inside text-white/60">
            <li>Paste any Reddit post URL to fetch details</li>
            <li>Configure token supply and initial pricing</li>
            <li>Launch your token and start trading</li>
            <li>Earn rewards as curator when your post gains momentum</li>
          </ul>
        </motion.div>
      )}
    </section>
  );
}


