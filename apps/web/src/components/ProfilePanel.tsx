import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/auth";

type DisplayUser = { username?: string; points?: number; avatarUrl?: string };

interface UserStats {
  totalPnL: number;
  totalPnLPercent: number;
  totalVolume30d: number;
}

interface RecentActivity {
  transactionId: string;
  type: "buy" | "sell";
  postTokenSymbol: string | null;
  amount: number;
  pricePerToken: string;
  totalValue: string;
  createdAt: string;
}

export default function ProfilePanel() {
  const { user } = useAuth();
  const display: DisplayUser = (user as DisplayUser) || { username: "guest", points: 0, avatarUrl: "" };
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch portfolio stats and transaction stats
        const [portfolioRes, transactionsRes, txStatsRes] = await Promise.all([
          fetchWithAuth("/api/portfolio/stats"),
          fetchWithAuth("/api/transactions?limit=4"),
          fetchWithAuth("/api/transactions/stats"),
        ]);

        const portfolioData = await portfolioRes.json();
        const transactionsData = await transactionsRes.json();
        const txStatsData = await txStatsRes.json();

        if (portfolioData.success && txStatsData.success) {
          setStats({
            totalPnL: portfolioData.stats.totalPnL,
            totalPnLPercent: portfolioData.stats.totalPnLPercent,
            totalVolume30d: parseFloat(txStatsData.stats.totalVolume || "0"), // Real total trading volume
          });
        }

        if (transactionsData.success) {
          setRecentActivity(transactionsData.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  return (
    <section className="w-full">
      {/* Hero card */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
            {display.avatarUrl ? (
              <img src={display.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-white/60">u/</div>
            )}
          </div>
          <div className="min-w-0">
            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="truncate text-xl font-semibold text-white"
            >
              u/{display.username ?? "guest"}
            </motion.h2>
            <p className="text-sm text-white/60">Member • Trading on RedCircle</p>
          </div>
        </div>

        {/* Hero ambient glow */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute -inset-px -z-10 blur-2xl"
          style={{
            background:
              "radial-gradient(600px 200px at 10% 0%, rgba(239,68,68,0.18), rgba(0,0,0,0)), radial-gradient(600px 200px at 90% 100%, rgba(59,130,246,0.18), rgba(0,0,0,0))",
          }}
        />
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {loading ? (
          // Loading skeletons
          [1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
              <div className="h-4 w-16 animate-pulse rounded bg-white/10"></div>
              <div className="mt-2 h-6 w-24 animate-pulse rounded bg-white/10"></div>
            </div>
          ))
        ) : (
          [
            { label: "Points", value: Intl.NumberFormat().format(display.points ?? 0) },
            { 
              label: "PnL", 
              value: stats 
                ? `${stats.totalPnLPercent >= 0 ? '+' : ''}${stats.totalPnLPercent.toFixed(2)}%` 
                : "0%",
              isPositive: stats ? stats.totalPnLPercent >= 0 : true,
            },
            { 
              label: "Volume 30d", 
              value: stats 
                ? `${Intl.NumberFormat().format(Math.round(stats.totalVolume30d))} SOL` 
                : "0 SOL" 
            },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-white/10 bg-black/60 p-5 text-white/80 backdrop-blur"
            >
              <div className="text-sm text-white/50">{s.label}</div>
              <div 
                className={`mt-2 text-xl ${
                  s.label === "PnL" 
                    ? s.isPositive 
                      ? "text-green-400" 
                      : "text-red-400"
                    : "text-white"
                }`}
              >
                {s.value}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Activity */}
      <motion.h3
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="mb-3 text-base font-semibold text-white"
      >
        Recent Activity
      </motion.h3>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {loading ? (
          <div className="bg-black/60 px-4 py-8 text-center backdrop-blur">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="bg-black/60 px-4 py-8 text-center backdrop-blur">
            <p className="text-sm text-white/60">No recent activity</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {recentActivity.map((activity) => {
              // Calculate time ago
              const diffMs = Date.now() - new Date(activity.createdAt).getTime();
              const diffMin = Math.max(1, Math.floor(diffMs / (1000 * 60)));
              const timeAgo = 
                diffMin < 60 ? `${diffMin}m ago` :
                diffMin < 1440 ? `${Math.floor(diffMin / 60)}h ago` :
                `${Math.floor(diffMin / 1440)}d ago`;

              const pricePerToken = parseFloat(activity.pricePerToken || "0");
              const totalValue = parseFloat(activity.totalValue || "0");
              
              return (
                <li key={activity.transactionId} className="grid grid-cols-12 bg-black/60 px-4 py-3 text-sm text-white/80 backdrop-blur">
                  <div className="col-span-6 truncate">
                    {activity.type === "buy" ? "Bought" : "Sold"} {(activity.amount || 0).toLocaleString()} {activity.postTokenSymbol || "tokens"} at {pricePerToken.toFixed(6)} SOL
                  </div>
                  <div className="col-span-3 text-white/60">{timeAgo}</div>
                  <div className={`col-span-3 text-right ${activity.type === "buy" ? "text-emerald-400" : "text-red-400"}`}>
                    {totalValue.toFixed(4)} SOL
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}


