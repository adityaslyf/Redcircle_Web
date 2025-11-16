import { Link } from "@tanstack/react-router";
import { Home, Trophy, Wallet, ArrowLeftRight, Rocket, User } from "lucide-react";

interface DesktopSidebarProps {
  currentPage?: "feed" | "leaderboard" | "portfolio" | "transactions" | "launch" | "profile";
  onNavigate?: (page: string) => void;
}

const NAV_ITEMS = [
  { key: "feed", label: "Feed", icon: Home, to: "/dashboard", search: { tab: "feed" }, resetScroll: true },
  { key: "leaderboard", label: "Board", icon: Trophy, to: "/dashboard", search: { tab: "leaderboard" }, resetScroll: true },
  { key: "portfolio", label: "Portfolio", icon: Wallet, to: "/dashboard", search: { tab: "portfolio" }, resetScroll: true },
  { key: "transactions", label: "History", icon: ArrowLeftRight, to: "/dashboard", search: { tab: "transactions" }, resetScroll: true },
  { key: "launch", label: "Launch", icon: Rocket, to: "/dashboard", search: { tab: "launch" }, resetScroll: true },
  { key: "profile", label: "Profile", icon: User, to: "/dashboard", search: { tab: "profile" }, resetScroll: true },
];

export default function DesktopSidebar({ currentPage, onNavigate }: DesktopSidebarProps) {
  return (
    <aside className="fixed left-2 md:left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-1.5 md:gap-2 md:flex" style={{ zIndex: 40 }}>
      <h2 className="mb-1.5 md:mb-2 pl-1 text-[10px] md:text-xs uppercase tracking-wider text-white/50">
        Dashboard
      </h2>
      {NAV_ITEMS.map((item) => {
        const isActive = currentPage === item.key;
        const Icon = item.icon;
        
        // For dashboard internal navigation (feed, leaderboard, profile)
        if ((item.key === "feed" || item.key === "leaderboard" || item.key === "profile") && onNavigate) {
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={
                "rounded-lg md:rounded-xl border px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm transition-all duration-200 flex items-center gap-2 " +
                (isActive
                  ? "border-white/20 bg-white/15 text-white shadow-lg shadow-white/5"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        }
        
        return (
          <Link
            key={item.key}
            to="/dashboard"
            search={{ tab: item.key }}
            resetScroll={item.resetScroll}
            className={
              "rounded-lg md:rounded-xl border px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm transition-all duration-200 flex items-center gap-2 " +
              (isActive
                ? "border-white/20 bg-white/15 text-white shadow-lg shadow-white/5"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")
            }
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}

