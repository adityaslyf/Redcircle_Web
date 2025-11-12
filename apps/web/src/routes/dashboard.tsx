import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import RedditFeed from "@/components/RedditFeed";
import Leaderboard from "../components/Leaderboard";
import ProfilePanel from "../components/ProfilePanel";
import LaunchPanel from "../components/LaunchPanel";

type TabKey = "feed" | "leaderboard" | "portfolio" | "launch" | "profile";

const TABS: { key: TabKey; label: string }[] = [
  { key: "feed", label: "Feed" },
  { key: "leaderboard", label: "Leaderboard" },
  { key: "portfolio", label: "Portfolio" },
  { key: "launch", label: "Launch" },
  { key: "profile", label: "Profile" },
];

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState<TabKey>("feed");

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
    <div className="relative min-h-screen pt-24">
      {/* Left vertical dashboard nav */}
      <aside className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
        <h2 className="mb-2 pl-1 text-xs uppercase tracking-wider text-white/50">Dashboard</h2>
        {TABS.map((t) => {
          const isActive = active === t.key;
          
          // Portfolio gets a direct link to its route
          if (t.key === "portfolio") {
            return (
              <Link
                key={t.key}
                to="/portfolio"
                className={
                  "rounded-xl border px-3 py-2 text-sm text-center transition-colors " +
                  (isActive
                    ? "border-white/20 bg-white/15 text-white"
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

      {/* Content with side padding to clear side nav */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:pl-28 sm:pr-10 sm:px-6 lg:px-8">
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


