import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { UserPlus, Search, ArrowUpCircle, TrendingUp, PartyPopper, Wallet } from "lucide-react";

export function RedCircleTimeline() {
  const data = [
    {
      title: "Day 1",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Join RedCircle</span> - Connect your wallet, explore the platform, and browse trending tokenized posts from Reddit.
          </p>
          <div className="mb-8">
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <UserPlus className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Sign up and verify your Reddit account</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <Wallet className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Connect your Solana wallet (Phantom, Solflare, etc.)</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <Search className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Browse the feed of trending tokenized posts</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80"
              alt="user signing up"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80"
              alt="crypto wallet"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80"
              alt="reddit feed"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
              alt="platform dashboard"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Day 3",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            <span className="font-semibold text-purple-600 dark:text-purple-400">Discover a Hidden Gem</span> - Find an undervalued post with viral potential before the crowd notices.
          </p>
          <div className="mb-8">
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <Search className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <span>Search through subreddits and discover trending topics</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <span>Analyze engagement metrics: upvotes, comments, awards</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <ArrowUpCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <span>Spot a post with 500 upvotes but only 3 token holders</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
              alt="social media analytics"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
              alt="data analytics"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"
              alt="reddit posts"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
              alt="metrics dashboard"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Week 1",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            <span className="font-semibold text-green-600 dark:text-green-400">Make Your First Trade</span> - Buy your first tokens using the bonding curve and watch the magic happen.
          </p>
          <div className="mb-8">
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <ArrowUpCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Buy 100 tokens at 0.01 SOL each (total: 1 SOL)</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Watch real-time price updates as bonding curve adjusts</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <Wallet className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Tokens appear in your portfolio instantly</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80"
              alt="cryptocurrency trading"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
              alt="trading chart"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80"
              alt="blockchain transaction"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80"
              alt="trading interface"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Week 2",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">Watch Your Portfolio Grow</span> - The post goes viral! Your early investment pays off as token value surges.
          </p>
          <div className="mb-8">
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <TrendingUp className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span>Post hits front page: 15k upvotes, 2k comments</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <ArrowUpCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span>Token price rises to 0.04 SOL (+300% gain!)</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <PartyPopper className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span>Your 1 SOL investment is now worth 4 SOL</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80"
              alt="growth chart"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80"
              alt="portfolio growth"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80"
              alt="crypto gains"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80"
              alt="viral content"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Month 1",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Cash Out Your First Profit</span> - Time to take profits! Sell at the peak and celebrate your success.
          </p>
          <div className="mb-8">
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Sell 50 tokens at 0.045 SOL = 2.25 SOL</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <Wallet className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Keep 50 tokens for long-term holding</span>
            </div>
            <div className="flex gap-3 items-start text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-3">
              <PartyPopper className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Net profit: 1.25 SOL (+125% ROI) in just 30 days!</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=800&q=80"
              alt="profit celebration"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
              alt="financial success"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
              alt="trading success"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
              alt="future success"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}

