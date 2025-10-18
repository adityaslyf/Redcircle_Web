import { motion } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";

type DisplayUser = { username?: string; points?: number; avatarUrl?: string };

export default function ProfilePanel() {
  const { user } = useAuth();
  const display: DisplayUser = (user as DisplayUser) || { username: "guest", points: 0, avatarUrl: "" };

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
        {[
          { label: "Points", value: Intl.NumberFormat().format(display.points ?? 0) },
          { label: "PnL", value: "+124.6%" },
          { label: "Volume 30d", value: "18,420 SOL" },
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
            <div className="mt-2 text-xl text-white">{s.value}</div>
          </motion.div>
        ))}
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
        <ul className="divide-y divide-white/10">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="grid grid-cols-12 bg-black/60 px-4 py-3 text-sm text-white/80 backdrop-blur">
              <div className="col-span-6 truncate">Bought 1,200 RED-POST at 0.042 SOL</div>
              <div className="col-span-3 text-white/60">2h ago</div>
              <div className="col-span-3 text-right text-emerald-400">+12.4%</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


