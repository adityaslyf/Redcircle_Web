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
    <div className="relative rounded-3xl border border-white/10 ring-1 ring-white/5 bg-neutral-950/80 backdrop-blur-sm p-6 sm:p-7 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-32px_rgba(0,0,0,0.8)] min-w-[320px] sm:min-w-[360px] max-w-[420px]">
      <div
        aria-hidden
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.6), transparent 60%)" }}
      />

      <div className="flex items-start gap-4">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-white/10"
          loading="lazy"
          draggable={false}
        />
        <div className="min-w-0">
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            “{t.quote}”
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
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
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          >
            Loved by traders and creators
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-neutral-400 text-base sm:text-lg md:text-xl mt-3"
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
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-black via-black/60 to-transparent" />

          {/* track 1 */}
          <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className="flex gap-6 sm:gap-8 md:gap-10 w-[200%]"
              style={{
                animation: "testimonials-marquee 28s linear infinite",
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
          <div className="h-6 sm:h-8" />

          {/* track 2 (reverse) */}
          <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className="flex gap-6 sm:gap-8 md:gap-10 w-[200%]"
              style={{
                animation: "testimonials-marquee-reverse 32s linear infinite",
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


