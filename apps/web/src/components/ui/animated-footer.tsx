"use client";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { TwitterIcon, GithubIcon, LinkedinIcon, CircleIcon } from "lucide-react";

export function AnimatedFooter() {
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the band renders crisp without gaps on some devices
    if (bandRef.current) bandRef.current.style.transform = "translateZ(0)";
  }, []);

  return (
    <footer className="relative w-full bg-black text-white pt-28 pb-16 px-6 overflow-hidden">
      {/* Animated top design band */}
      <div ref={bandRef} className="absolute top-0 left-0 right-0 h-24 overflow-hidden">
        {/* flowing grid highlight */}
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 24px)",
            backgroundSize: "200% 100%, 100% 200%",
          }}
          animate={{ backgroundPositionX: ["0%", "-100%"], backgroundPositionY: ["0%", "100%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
        {/* diagonal streaks */}
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(35deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 18px)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPositionX: ["100%", "0%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
        {/* soft aurora blobs */}
        <motion.div
          aria-hidden
          className="absolute -top-16 left-1/4 h-48 w-48 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.40), transparent 70%)" }}
          animate={{ x: [ -120, 120, -120 ] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -top-20 right-1/4 h-56 w-56 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(236,72,153,0.35), transparent 70%)" }}
          animate={{ x: [ 160, -160, 160 ] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* thin glow divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      {/* Subtle moving grid across the whole footer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.7) 0 1px, transparent 1px 40px)",
            backgroundSize: "100% 200%, 200% 100%",
          }}
          animate={{ backgroundPositionY: ["0%", "100%"], backgroundPositionX: ["0%", "100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Large watermark text in the back */}
      <div className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-12 z-[1]">
        <div className="text-white/5 font-extrabold uppercase tracking-tight text-6xl md:text-[10rem] leading-none">
          REDCIRCLE
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <CircleIcon className="w-10 h-10 text-red-500 fill-red-500" />
            <span className="text-3xl font-bold tracking-tight">RedCircle</span>
          </div>
          <p className="text-neutral-400 max-w-xl">
            Tokenizing viral Reddit content on Solana blockchain. Turn social media engagement into real financial value.
          </p>
        </div>

        {/* Marquee highlights */}
        <div className="relative mb-10 overflow-hidden">
          <style>{`@keyframes rc-scroll-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
          <div className="pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className="whitespace-nowrap flex gap-12"
              style={{ width: "200%", animation: "rc-scroll-x 24s linear infinite" }}
            >
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-12 text-neutral-500">
                  {[
                    "Web3 Social",
                    "Solana Blockchain",
                    "Reddit Integration",
                    "Token Trading",
                    "Decentralized Finance",
                    "Content Monetization",
                    "Community Rewards",
                  ].map((label) => (
                    <span key={`${i}-${label}`} className="tracking-wide text-sm">
                      {label}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <MotionCol title="Platform" links={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Browse Posts", href: "/posts" },
            { label: "Marketplace", href: "/market" },
          ]} delay={0.05} />
          <MotionCol title="Features" links={[
            { label: "Tokenize Posts", href: "/tokenize" },
            { label: "Trade Tokens", href: "/trade" },
            { label: "Earn Rewards", href: "/rewards" },
          ]} delay={0.1} />
          <MotionCol title="Resources" links={[
            { label: "Documentation", href: "/docs" },
            { label: "Whitepaper", href: "/whitepaper" },
            { label: "API", href: "/api" },
          ]} delay={0.15} />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-4">Follow</h3>
            <div className="flex items-center gap-5 text-neutral-400">
              <a className="hover:text-white transition-colors" href="https://twitter.com/adityaslyf" target="_blank" rel="noreferrer" aria-label="Twitter"><TwitterIcon className="w-5 h-5" /></a>
              <a className="hover:text-white transition-colors" href="https://github.com/adityaslyf" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon className="w-5 h-5" /></a>
              <a className="hover:text-white transition-colors" href="https://www.linkedin.com/in/aditya-varshney-089b33244/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon className="w-5 h-5" /></a>
            </div>
          </motion.div>
        </div>

        {/* bottom row */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-neutral-500 text-sm">
          <span>© {new Date().getFullYear()} RedCircle. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MotionCol({ title, links, delay = 0 }: { title: string; links: { label: string; href: string }[]; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-neutral-300 hover:text-white transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}


