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

  // Parallax transforms - optimized for mobile
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 0.7, 1]);

  return (
    <motion.div 
      ref={cardRef} 
      style={{ scale, y, opacity }} 
      className="sticky top-[12vh] sm:top-[15vh] md:top-[18vh] mb-8 sm:mb-10 md:mb-12"
    >
      <div
        className="relative rounded-2xl sm:rounded-3xl bg-black border border-white/40 ring-1 ring-white/20 p-6 sm:p-8 md:p-12 lg:p-16 min-h-[22rem] sm:min-h-[24rem] md:min-h-[28rem] lg:min-h-[32rem] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-32px_rgba(0,0,0,0.8)]"
        style={{ zIndex: index + 1 }}
      >
        {/* Subtle grid & gradient wash */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.8) 0 1px, transparent 1px 24px),repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0 1px, transparent 1px 24px)",
          backgroundSize: "100% 100%",
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/0 via-neutral-900/40 to-neutral-950/0" />
        {/* Accent orb - responsive sizing */}
        <div className={`pointer-events-none absolute -top-16 sm:-top-20 md:-top-24 -right-16 sm:-right-20 md:-right-24 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-br ${feature.gradient} opacity-20 blur-3xl rounded-full`} />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 md:gap-7 lg:gap-9">
            <div className="flex-shrink-0 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg">
              <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 lg:mb-7 tracking-tight leading-tight uppercase font-1797">
                {feature.title}
              </h3>
              <p className="text-neutral-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl">
                {feature.description}
              </p>
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
      <div className="relative z-10 pt-16 sm:pt-20 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-5 md:mb-6 tracking-tight font-1797 uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Powerful Features
        </motion.h2>
        <motion.p
          className="text-neutral-400 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Everything you need to tokenize, trade, and profit from viral social content on Web3
        </motion.p>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 md:pb-36">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>

      <div className="h-[30vh] sm:h-[40vh] md:h-[50vh]" />
    </section>
  );
}


