// @ts-expect-error - ScrollStack is JSX
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { Sparkles, Zap, Shield, Layers } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Design',
    description: 'Leverage cutting-edge artificial intelligence to create stunning, pixel-perfect designs that captivate your audience and drive engagement.',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-500/10 to-pink-600/10',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Performance',
    description: 'Built on modern frameworks with optimized rendering for instant page loads and seamless interactions across all devices.',
    gradient: 'from-yellow-400 to-orange-500',
    bgGradient: 'from-yellow-400/10 to-orange-500/10',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and security protocols ensure your data remains protected with industry-leading compliance standards.',
    gradient: 'from-emerald-400 to-teal-500',
    bgGradient: 'from-emerald-400/10 to-teal-500/10',
  },
  {
    icon: Layers,
    title: 'Scalable Architecture',
    description: 'Infrastructure that grows with your business, handling millions of requests with zero downtime and maximum reliability.',
    gradient: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-400/10 to-cyan-500/10',
  },
];

export default function Features() {
  return (
    <section className="relative w-full bg-black">
      {/* Section header */}
      <div className="relative z-10 pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Platform Features
        </h2>
        <p className="text-neutral-400 text-xl md:text-2xl leading-relaxed">
          Everything you need to build exceptional digital experiences
        </p>
      </div>

      {/* ScrollStack cards */}
      <div className="w-full max-w-6xl mx-auto px-6 pb-20">
        <ScrollStack
          itemDistance={150}
          itemScale={0.05}
          itemStackDistance={40}
          stackPosition="20%"
          baseScale={0.88}
          rotationAmount={0}
          blurAmount={0}
          useWindowScroll={true}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollStackItem key={index}>
                <div 
                  className={`h-full w-full rounded-[2.5rem] bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl border border-white/10 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden`}
                  style={{ zIndex: index + 1 }}
                >
                  {/* Animated gradient orb in background */}
                  <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${feature.gradient} opacity-20 blur-3xl rounded-full`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-6 md:gap-8">
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-4 md:p-5 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="text-neutral-300 text-lg md:text-2xl leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
}

