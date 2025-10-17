import * as React from "react";
import { Coins, TrendingUp, Trophy, ChevronDown, Twitter, Github } from "lucide-react";
import { motion } from "motion/react";

interface CardData {
  title: string;
  description: string;
  Icon: React.ElementType;
  gradient: string;
  socialLinks?: { icon: React.ElementType; url: string }[];
}

// removed unused RedCircleLogo

interface GlassCardProps {
  data: CardData;
  index: number;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ data, index }, ref) => {
    const { title, description, Icon, gradient, socialLinks = [] } = data;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="group h-[300px] w-[290px] [perspective:1000px]"
      >
        <div className={`relative h-full rounded-[50px] bg-gradient-to-br ${gradient} shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(0,0,0,0.3)_30px_50px_25px_-40px,rgba(0,0,0,0.1)_0px_25px_30px_0px] group-hover:[transform:rotate3d(1,1,0,30deg)]`}>
          <div className="absolute inset-2 rounded-[55px] border-b border-l border-white/20 bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-sm [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]"></div>
          
          <div className="absolute [transform:translate3d(0,0,26px)]">
            <div className="px-7 pt-[100px] pb-0">
              <span className="block text-xl font-black text-white font-satoshi">
                {title}
              </span>
              <span className="mt-5 block text-[15px] text-zinc-300">
                {description}
              </span>
            </div>
          </div>
          
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between [transform-style:preserve-3d] [transform:translate3d(0,0,26px)]">
            <div className="flex gap-2.5 [transform-style:preserve-3d]">
              {socialLinks.map(({ icon: SocialIcon }, idx) => (
                <button
                  key={idx}
                  className="group/social grid h-[30px] w-[30px] place-content-center rounded-full border-none bg-white shadow-[rgba(0,0,0,0.5)_0px_7px_5px_-5px] transition-all duration-200 ease-in-out group-hover:[box-shadow:rgba(0,0,0,0.2)_-5px_20px_10px_0px] group-hover:[transform:translate3d(0,0,50px)] hover:bg-red-500 active:bg-red-600"
                  style={{ transitionDelay: `${(idx + 1) * 200}ms` }}
                >
                  <SocialIcon className="h-4 w-4 stroke-black group-hover/social:stroke-white transition-colors" />
                </button>
              ))}
            </div>
            <div className="flex w-2/5 cursor-pointer items-center justify-end transition-all duration-200 ease-in-out hover:[transform:translate3d(0,0,10px)]">
              <button className="border-none bg-none text-xs font-bold text-white">
                Learn more
              </button>
              <ChevronDown className="h-4 w-4 stroke-white" strokeWidth={3} />
            </div>
          </div>
          
          <div className="absolute top-0 right-0 [transform-style:preserve-3d]">
            {[
              { size: "170px", pos: "8px", z: "20px", delay: "0s" },
              { size: "140px", pos: "10px", z: "40px", delay: "0.4s" },
              { size: "110px", pos: "17px", z: "60px", delay: "0.8s" },
              { size: "80px", pos: "23px", z: "80px", delay: "1.2s" },
            ].map((circle, idx) => (
              <div
                key={idx}
                className="absolute aspect-square rounded-full bg-white/10 shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out"
                style={{
                  width: circle.size,
                  top: circle.pos,
                  right: circle.pos,
                  transform: `translate3d(0, 0, ${circle.z})`,
                  transitionDelay: circle.delay,
                }}
              ></div>
            ))}
            <div
              className="absolute grid aspect-square w-[50px] place-content-center rounded-full bg-white shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out [transform:translate3d(0,0,100px)] [transition-delay:1.6s] group-hover:[transform:translate3d(0,0,120px)]"
              style={{ top: "30px", right: "30px" }}
            >
              <Icon className="w-6 h-6 text-red-500" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

const cardsData: CardData[] = [
  {
    title: "Tokenize",
    description: "Turn viral Reddit posts into tradeable Solana tokens with real-time valuation.",
    Icon: Coins,
    gradient: "from-red-500 to-orange-600",
    socialLinks: [
      { icon: Twitter, url: "#" },
      { icon: Github, url: "#" },
    ],
  },
  {
    title: "Trade",
    description: "Buy and sell post tokens in a decentralized marketplace powered by Solana.",
    Icon: TrendingUp,
    gradient: "from-purple-600 to-pink-600",
    socialLinks: [
      { icon: Twitter, url: "#" },
      { icon: Github, url: "#" },
    ],
  },
  {
    title: "Earn Rewards",
    description: "Get crypto rewards for submitting viral content and successful trading.",
    Icon: Trophy,
    gradient: "from-blue-500 to-cyan-500",
    socialLinks: [
      { icon: Twitter, url: "#" },
      { icon: Github, url: "#" },
    ],
  },
];

export default function RedCircleCards() {
  return (
    <section className="relative w-full bg-black py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-satoshi">
            How It Works
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Transform social engagement into financial opportunities in three simple steps
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {cardsData.map((card, index) => (
            <GlassCard key={index} data={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

