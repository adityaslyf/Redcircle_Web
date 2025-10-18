import { motion } from "motion/react";
import { useMemo, useState } from "react";

type Category = "author" | "curator";

type Entry = {
  id: string;
  user: string;
  avatar?: string;
  pnl: number; // percentage
  volume: number; // SOL
  category: Category;
};

const MOCK: Entry[] = [
  { id: "1", user: "quantum_builder", pnl: 182.4, volume: 12420, category: "author" },
  { id: "2", user: "uimotion", pnl: 141.1, volume: 9820, category: "author" },
  { id: "3", user: "growthloop", pnl: 119.7, volume: 7442, category: "author" },
  { id: "4", user: "satoshifan", pnl: 88.2, volume: 5320, category: "author" },
  { id: "5", user: "alpha_scan", pnl: 72.9, volume: 4981, category: "author" },
  { id: "6", user: "curation_dao", pnl: 164.2, volume: 15210, category: "curator" },
  { id: "7", user: "alpha_curator", pnl: 137.5, volume: 10110, category: "curator" },
  { id: "8", user: "signal_hub", pnl: 106.3, volume: 8422, category: "curator" },
  { id: "9", user: "vault_xyz", pnl: 93.8, volume: 7301, category: "curator" },
  { id: "10", user: "trend_maker", pnl: 77.4, volume: 5680, category: "curator" },
];

export default function Leaderboard({ sideFilters = false }: { sideFilters?: boolean }) {
  const [category, setCategory] = useState<Category>("author");
  const data = useMemo(() => MOCK.filter((e) => e.category === category), [category]);

  return (
    <section className="w-full">
      <div className="mx-auto mb-4 flex max-w-4xl items-center justify-between px-2">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-lg font-semibold text-white sm:text-xl"
        >
          Leaderboard
        </motion.h2>
        {!sideFilters && (
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => setCategory("author")}
              className={
                "rounded-lg border px-3 py-1 text-sm transition-colors " +
                (category === "author"
                  ? "border-white/20 bg-white/15 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")
              }
            >
              Author
            </button>
            <button
              onClick={() => setCategory("curator")}
              className={
                "rounded-lg border px-3 py-1 text-sm transition-colors " +
                (category === "curator"
                  ? "border-white/20 bg-white/15 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")
              }
            >
              Curator
            </button>
          </div>
        )}
      </div>

      {sideFilters && (
        <aside className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
          <h3 className="mb-2 pl-1 text-xs uppercase tracking-wider text-white/50">Filter</h3>
          <button
            onClick={() => setCategory("author")}
            className={
              "rounded-xl border px-3 py-2 text-sm transition-colors " +
              (category === "author"
                ? "border-white/20 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")
            }
          >
            Author
          </button>
          <button
            onClick={() => setCategory("curator")}
            className={
              "rounded-xl border px-3 py-2 text-sm transition-colors " +
              (category === "curator"
                ? "border-white/20 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")
            }
          >
            Curator
          </button>
        </aside>
      )}

      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-12 bg-white/[0.04] px-4 py-2 text-xs text-white/60">
          <div className="col-span-6">User</div>
          <div className="col-span-3 text-right">PnL</div>
          <div className="col-span-3 text-right">Volume</div>
        </div>
        <ul className="divide-y divide-white/10">
          {data.map((e, idx) => (
            <li key={e.id} className="grid grid-cols-12 items-center bg-black/60 px-4 py-3 backdrop-blur">
              <div className="col-span-6 truncate text-white/90">
                <span className="mr-3 inline-block w-5 text-white/40">{idx + 1}</span>
                u/{e.user}
              </div>
              <div className="col-span-3 text-right font-medium text-emerald-400">{e.pnl.toFixed(1)}%</div>
              <div className="col-span-3 text-right text-white/70">{Intl.NumberFormat().format(e.volume)} SOL</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


