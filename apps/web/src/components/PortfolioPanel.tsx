import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/auth";

interface Holding {
  holdingId: string;
  postId: string;
  tokenMintAddress: string;
  amount: number;
  averageBuyPrice: number;
  totalInvested: number;
  totalRealized: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  post: {
    id: string;
    title: string;
    subreddit: string;
    author: string;
    tokenSymbol: string;
    thumbnail: string | null;
    upvotes: number;
    comments: number;
  } | null;
}

interface PortfolioStats {
  totalInvested: number;
  totalCurrentValue: number;
  totalRealized: number;
  totalPnL: number;
  totalPnLPercent: number;
  holdingsCount: number;
}

export default function PortfolioPanel() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Holding[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const response = await fetchWithAuth("/api/portfolio");
      const data = await response.json();

      if (data.success) {
        setPortfolio(data.portfolio);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Portfolio</h1>
        <p className="mt-1 text-xs sm:text-sm text-white/60">Track your token holdings and performance</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
          {/* Total Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6 backdrop-blur"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/60">
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-xs md:text-sm">Total Value</span>
            </div>
            <p className="mt-1.5 sm:mt-2 text-base sm:text-xl md:text-2xl font-bold text-white">
              {stats.totalCurrentValue.toFixed(2)} <span className="text-xs sm:text-sm">SOL</span>
            </p>
            <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs text-white/40">
              Inv: {stats.totalInvested.toFixed(2)} SOL
            </p>
          </motion.div>

          {/* Total P&L */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6 backdrop-blur"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/60">
              {stats.totalPnL >= 0 ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
              )}
              <span className="text-[10px] sm:text-xs md:text-sm">Total P&L</span>
            </div>
            <p className={`mt-1.5 sm:mt-2 text-base sm:text-xl md:text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}{stats.totalPnL.toFixed(2)} <span className="text-xs sm:text-sm">SOL</span>
            </p>
            <p className={`mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs ${stats.totalPnLPercent >= 0 ? 'text-green-400/60' : 'text-red-400/60'}`}>
              {stats.totalPnLPercent >= 0 ? '+' : ''}{stats.totalPnLPercent.toFixed(2)}%
            </p>
          </motion.div>

          {/* Realized P&L */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6 backdrop-blur"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/60">
              <span className="text-[10px] sm:text-xs md:text-sm">Realized</span>
            </div>
            <p className="mt-1.5 sm:mt-2 text-base sm:text-xl md:text-2xl font-bold text-white">
              {stats.totalRealized.toFixed(2)} <span className="text-xs sm:text-sm">SOL</span>
            </p>
            <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs text-white/40">From sold</p>
          </motion.div>

          {/* Holdings Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-6 backdrop-blur"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/60">
              <span className="text-[10px] sm:text-xs md:text-sm">Holdings</span>
            </div>
            <p className="mt-1.5 sm:mt-2 text-base sm:text-xl md:text-2xl font-bold text-white">
              {stats.holdingsCount}
            </p>
            <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs text-white/40">Active</p>
          </motion.div>
        </div>
      )}

      {/* Holdings Table */}
      {portfolio.length === 0 ? (
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 md:p-12 text-center">
          <p className="text-base sm:text-lg md:text-xl text-white/70">📭 No holdings yet</p>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-white/50">
            Start trading to build your portfolio!
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs md:text-sm font-semibold text-white">Token</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-[10px] sm:text-xs md:text-sm font-semibold text-white">Amount</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-[10px] sm:text-xs md:text-sm font-semibold text-white">Avg Buy</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-[10px] sm:text-xs md:text-sm font-semibold text-white">Current</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-[10px] sm:text-xs md:text-sm font-semibold text-white">Value</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-[10px] sm:text-xs md:text-sm font-semibold text-white">P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((holding, index) => (
                  <motion.tr
                    key={holding.holdingId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                      {holding.post ? (
                        <div>
                          <p className="font-medium text-white line-clamp-1 text-[10px] sm:text-xs md:text-sm">
                            {holding.post.title}
                          </p>
                          <p className="text-[9px] sm:text-[10px] md:text-xs text-white/50">
                            r/{holding.post.subreddit}
                          </p>
                        </div>
                      ) : (
                        <p className="text-white/50 text-[10px] sm:text-xs">Unknown Post</p>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-white text-[10px] sm:text-xs md:text-sm">
                      {holding.amount.toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-white/70 text-[10px] sm:text-xs md:text-sm">
                      {holding.averageBuyPrice.toFixed(6)}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-white/70 text-[10px] sm:text-xs md:text-sm">
                      {holding.currentPrice.toFixed(6)}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right font-medium text-white text-[10px] sm:text-xs md:text-sm">
                      {holding.currentValue.toFixed(4)} SOL
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right">
                      <div className={holding.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                        <p className="font-medium text-[10px] sm:text-xs md:text-sm">
                          {holding.unrealizedPnL >= 0 ? '+' : ''}{holding.unrealizedPnL.toFixed(4)} SOL
                        </p>
                        <p className="text-[9px] sm:text-[10px] md:text-xs opacity-70">
                          {holding.unrealizedPnLPercent >= 0 ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

