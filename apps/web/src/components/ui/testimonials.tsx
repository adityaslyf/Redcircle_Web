"use client";
import { motion } from "motion/react";
import * as React from "react";

type Testimonial = {
	quote: string;
	name: string;
	title: string;
	avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "RedCircle is redefining social finance. Turning Reddit virality into tradeable assets on Solana is a game-changer.",
    name: "Ava Chen",
    title: "DeFi Research Lead, Helios",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80",
  },
  {
    quote:
      "The tokenization flow is smooth and intuitive. I discovered posts, bought tokens, and saw real upside.",
    name: "Marcus Lee",
    title: "Early User & Trader",
    avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=256&q=80",
  },
  {
    quote:
      "As a creator, I finally get rewarded for posts that go viral. The marketplace feels fast and fair.",
    name: "Priya Nair",
    title: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=256&q=80",
  },
  {
    quote:
      "Fast, intuitive, and truly innovative. This is the missing link between social and finance.",
    name: "Diego Morales",
    title: "Algo Trader",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&q=80",
  },
  {
    quote:
      "I love how seamless it is to discover hot posts and back them with real value.",
    name: "Sara Kim",
    title: "Community Manager",
    avatar: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=256&q=80",
  },
];

function TestimonialCard(t: Testimonial) {
	return (
    <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 ring-1 ring-white/5 bg-neutral-950/80 backdrop-blur-sm p-4 sm:p-6 md:p-7 lg:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-32px_rgba(0,0,0,0.8)] min-w-[280px] sm:min-w-[320px] md:min-w-[360px] max-w-[380px] sm:max-w-[420px]">
      <div
        aria-hidden
        className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.6), transparent 60%)" }}
      />

      <div className="flex items-start gap-3 sm:gap-4">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border border-white/10 flex-shrink-0"
          loading="lazy"
          draggable={false}
        />
        <div className="min-w-0 flex-1">
          <p className="text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed">
            "{t.quote}"
          </p>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-white font-semibold truncate">{t.name}</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400 truncate">{t.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative w-full bg-black py-24 sm:py-28 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-satoshi"
          >
            Loved by traders and creators
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-neutral-400 text-sm sm:text-base md:text-lg lg:text-xl mt-2 sm:mt-3 px-2"
          >
            Real stories from people building and investing in the social finance future.
          </motion.p>
        </div>

        {/* marquee keyframes */}
        <style>{`
          @keyframes testimonials-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes testimonials-marquee-reverse {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }
        `}</style>

        <div className="relative overflow-hidden group">
          {/* edge mask for sleek fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 md:w-36 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 md:w-36 bg-gradient-to-l from-black via-black/60 to-transparent z-10" />

          {/* track 1 */}
          <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-[200%]"
              style={{
                animation: "testimonials-marquee 35s linear infinite",
                animationPlayState: "running",
              }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={`row1-${i}`} className="shrink-0">
                  {TestimonialCard(t)}
                </div>
              ))}
            </div>
          </div>

          {/* spacing between rows */}
          <div className="h-4 sm:h-6 md:h-8" />

          {/* track 2 (reverse) */}
          <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-[200%]"
              style={{
                animation: "testimonials-marquee-reverse 40s linear infinite",
                animationPlayState: "running",
              }}
            >
              {[...testimonials.slice().reverse(), ...testimonials.slice().reverse()].map((t, i) => (
                <div key={`row2-${i}`} className="shrink-0">
                  {TestimonialCard(t)}
                </div>
              ))}
            </div>
          </div>

          {/* pause on hover */}
          <script dangerouslySetInnerHTML={{
            __html: `
              document.currentScript?.previousElementSibling?.previousElementSibling?.addEventListener('mouseenter', (e) => {
                const tracks = e.currentTarget.parentElement?.querySelectorAll('[style*="testimonials-marquee"], [style*="testimonials-marquee-reverse"]');
                tracks?.forEach((el) => (el as HTMLElement).style.animationPlayState = 'paused');
              });
              document.currentScript?.previousElementSibling?.previousElementSibling?.addEventListener('mouseleave', (e) => {
                const tracks = e.currentTarget.parentElement?.querySelectorAll('[style*="testimonials-marquee"], [style*="testimonials-marquee-reverse"]');
                tracks?.forEach((el) => (el as HTMLElement).style.animationPlayState = 'running');
              });
            `
          }} />
        </div>
      </div>
    </section>
  );
}


