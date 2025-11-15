import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link, useSearch } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import RedditFeed from "@/components/RedditFeed";
import Leaderboard from "../components/Leaderboard";
import ProfilePanel from "../components/ProfilePanel";
import LaunchPanel from "../components/LaunchPanel";
import { Home, Trophy, Wallet, ArrowLeftRight, Rocket, User } from "lucide-react";

type TabKey = "feed" | "leaderboard" | "portfolio" | "transactions" | "launch" | "profile";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { key: "feed", label: "Feed", icon: Home },
  { key: "leaderboard", label: "Board", icon: Trophy },
  { key: "portfolio", label: "Portfolio", icon: Wallet },
  { key: "transactions", label: "History", icon: ArrowLeftRight },
  { key: "launch", label: "Launch", icon: Rocket },
  { key: "profile", label: "Profile", icon: User },
];

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as TabKey) || undefined,
    };
  },
});

function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/dashboard" });
  const [active, setActive] = useState<TabKey>(search.tab || "feed");

  // Update active tab when URL search param changes
  useEffect(() => {
    if (search.tab) {
      setActive(search.tab);
    }
  }, [search.tab]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to sign-in if not authenticated
      navigate({ 
        to: "/signin",
        search: { redirect: "/dashboard" }
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-20 md:pb-0">
      {/* Mobile horizontal navigation - Bottom fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-inset-bottom">
        {/* Glassmorphism background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/80 backdrop-blur-xl border-t border-white/10"></div>
        
        <div className="relative flex gap-1 px-2 py-2.5 justify-between">
          {TABS.map((t) => {
            const isActive = active === t.key;
            const Icon = t.icon;
            
            // Portfolio and Transactions get direct links to their routes
            if (t.key === "portfolio" || t.key === "transactions") {
              return (
                <Link
                  key={t.key}
                  to={t.key === "portfolio" ? "/portfolio" : "/transactions"}
                  className="flex-1 relative group"
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={
                      "relative flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 " +
                      (isActive
                        ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20"
                        : "bg-white/5 active:bg-white/10")
                    }
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-purple-500/30 rounded-xl border border-purple-500/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    {/* Icon */}
                    <Icon 
                      className={
                        "relative z-10 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 " +
                        (isActive 
                          ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
                          : "text-white/60 group-active:text-white/80")
                      }
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    
                    {/* Label */}
                    <span 
                      className={
                        "relative z-10 text-[9px] sm:text-[10px] font-medium transition-all duration-300 " +
                        (isActive 
                          ? "text-white" 
                          : "text-white/60 group-active:text-white/80")
                      }
                    >
                      {t.label}
                    </span>
                    
                    {/* Glow effect for active tab */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl blur-xl"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            }
            
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className="flex-1 relative group"
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={
                    "relative flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 " +
                    (isActive
                      ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20"
                      : "bg-white/5 active:bg-white/10")
                  }
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-purple-500/30 rounded-xl border border-purple-500/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon */}
                  <Icon 
                    className={
                      "relative z-10 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 " +
                      (isActive 
                        ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
                        : "text-white/60 group-active:text-white/80")
                    }
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* Label */}
                  <span 
                    className={
                      "relative z-10 text-[9px] sm:text-[10px] font-medium transition-all duration-300 " +
                      (isActive 
                        ? "text-white" 
                        : "text-white/60 group-active:text-white/80")
                    }
                  >
                    {t.label}
                  </span>
                  
                  {/* Glow effect for active tab */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl blur-xl"
                    />
                  )}
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Left vertical dashboard nav - Desktop only */}
      <aside className="fixed left-2 md:left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1.5 md:gap-2 md:flex">
        <h2 className="mb-1.5 md:mb-2 pl-1 text-[10px] md:text-xs uppercase tracking-wider text-white/50">Dashboard</h2>
        {TABS.map((t) => {
          const isActive = active === t.key;
          
          // Portfolio and Transactions get direct links to their routes
          if (t.key === "portfolio" || t.key === "transactions") {
            return (
              <Link
                key={t.key}
                to={t.key === "portfolio" ? "/portfolio" : "/transactions"}
                className={
                  "rounded-lg md:rounded-xl border px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-center transition-all duration-200 " +
                  (isActive
                    ? "border-white/20 bg-white/15 text-white shadow-lg shadow-white/5"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")
                }
              >
                {t.label}
              </Link>
            );
          }
          
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={
                "rounded-lg md:rounded-xl border px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm transition-all duration-200 " +
                (isActive
                  ? "border-white/20 bg-white/15 text-white shadow-lg shadow-white/5"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")
              }
            >
              {t.label}
            </button>
          );
        })}
      </aside>

      {/* Content with side padding to clear side nav */}
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-20 pt-3 sm:pt-6 md:pt-8 md:pl-28 md:pr-10 lg:pl-32 lg:pr-12">
        <AnimatePresence mode="wait">
          {active === "feed" && (
            <motion.div key="feed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <RedditFeed sideFilters />
            </motion.div>
          )}
          {active === "leaderboard" && (
            <motion.div key="leaderboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Leaderboard sideFilters />
            </motion.div>
          )}
          {active === "launch" && (
            <motion.div key="launch" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="mx-auto max-w-5xl">
                <LaunchPanel />
              </div>
            </motion.div>
          )}
          {active === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="mx-auto max-w-5xl">
                <ProfilePanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


