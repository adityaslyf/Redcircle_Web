import { useScroll, useTransform, motion } from "motion/react";
import { useRef } from "react";
import { Link2, Coins, TrendingUp, Trophy } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Reddit Integration",
    description:
      "Seamlessly connect your Reddit account with OAuth authentication. Browse, analyze, and submit viral posts directly from your favorite subreddits with real-time engagement metrics.",
    gradient: "from-orange-500 to-red-600",
    bgGradient: "from-orange-500/10 to-red-600/10",
  },
  {
    icon: Coins,
    title: "Post Tokenization",
    description:
      "Transform viral Reddit posts into tradeable digital assets on Solana blockchain. Each post becomes a unique token with value determined by community engagement and trading activity.",
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-500/10 to-pink-600/10",
  },
  {
    icon: TrendingUp,
    title: "Social Trading",
    description:
      "Buy, sell, and trade post tokens like stocks in a decentralized marketplace. Track performance metrics, analyze trends, and build your portfolio of viral content investments.",
    gradient: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-400/10 to-cyan-500/10",
  },
  {
    icon: Trophy,
    title: "Rewards System",
    description:
      "Earn points and cryptocurrency rewards for submitting popular posts. The more engagement your submissions generate, the more you earn. Top contributors get exclusive perks and bonuses.",
    gradient: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-400/10 to-orange-500/10",
  },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = feature.icon;

  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "start start"] });

  // Parallax transforms
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 0.6, 1]);

  return (
    <motion.div ref={cardRef} style={{ scale, y, opacity }} className="sticky top-[18vh] mb-12">
      <div
        className="relative rounded-3xl bg-neutral-950 border border-white/10 ring-1 ring-white/5 p-10 md:p-16 min-h-[26rem] md:min-h-[32rem] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-32px_rgba(0,0,0,0.8)]"
        style={{ zIndex: index + 1 }}
      >
        {/* Subtle grid & gradient wash */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.8) 0 1px, transparent 1px 36px),repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0 1px, transparent 1px 36px)",
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/0 via-neutral-900/40 to-neutral-950/0" />
        {/* Accent orb */}
        <div className={`pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br ${feature.gradient} opacity-20 blur-3xl rounded-full`} />

        <div className="relative z-10">
          <div className="flex items-start gap-7 md:gap-9">
            <div className="flex-shrink-0 p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg">
              <Icon className="w-9 h-9 md:w-11 md:h-11 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-4xl md:text-6xl font-bold text-white mb-5 md:mb-7 tracking-tight">{feature.title}</h3>
              <p className="text-neutral-300 text-lg md:text-xl leading-relaxed max-w-3xl">{feature.description}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesParallax() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="relative w-full bg-black">
      <div className="relative z-10 pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <motion.h2
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Powerful Features
        </motion.h2>
        <motion.p
          className="text-neutral-400 text-xl md:text-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Everything you need to tokenize, trade, and profit from viral social content on Web3
        </motion.p>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 pb-36">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>

      <div className="h-[50vh]" />
    </section>
  );
}


