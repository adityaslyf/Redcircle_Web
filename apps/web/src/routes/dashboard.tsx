import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import RedditFeed from "@/components/RedditFeed";
import Leaderboard from "../components/Leaderboard";
import ProfilePanel from "../components/ProfilePanel";
import LaunchPanel from "../components/LaunchPanel";
import { SplashCursor } from "@/components/ui/splash-cursor";

type TabKey = "feed" | "leaderboard" | "profile" | "launch";

const TABS: { key: TabKey; label: string }[] = [
  { key: "feed", label: "Feed" },
  { key: "leaderboard", label: "Leaderboard" },
  { key: "launch", label: "Launch" },
  { key: "profile", label: "Profile" },
];

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [active, setActive] = useState<TabKey>("feed");

  return (
    <div className="relative min-h-screen">
      <SplashCursor />

      {/* Left vertical dashboard nav */}
      <aside className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
        <h2 className="mb-2 pl-1 text-xs uppercase tracking-wider text-white/50">Dashboard</h2>
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

      {/* Content with side padding to clear side nav */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:pl-28 sm:pr-10 sm:px-6 lg:px-8">
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


