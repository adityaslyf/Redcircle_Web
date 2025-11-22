"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const RedditIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="w-full h-full text-[#FF4500]"
	>
		<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
	</svg>
);

const BankIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="w-full h-full text-[#14F195]"
	>
		<line x1="3" x2="21" y1="22" y2="22" />
		<line x1="6" x2="6" y1="18" y2="11" />
		<line x1="10" x2="10" y1="18" y2="11" />
		<line x1="14" x2="14" y1="18" y2="11" />
		<line x1="18" x2="18" y1="18" y2="11" />
		<polygon points="12 2 20 7 4 7" />
	</svg>
);

function ShootingStars() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{Array.from({ length: 15 }).map((_, i) => (
				<motion.div
					key={i}
					className="absolute h-0.5 bg-gradient-to-r from-transparent via-neutral-500 to-transparent dark:via-white w-20 md:w-32"
					initial={{
						x: Math.random() * 100 + "%",
						y: Math.random() * 100 + "%",
						rotate: -45,
						opacity: 0,
					}}
					animate={{
						x: [null, `calc(${Math.random() * 100}% - 1000px)`],
						y: [null, `calc(${Math.random() * 100}% + 1000px)`],
						opacity: [0, 1, 0],
					}}
					transition={{
						duration: Math.random() * 5 + 3,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
						delay: Math.random() * 5,
					}}
				/>
			))}
		</div>
	);
}

function AnimatedGrid() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
		</div>
	);
}

function AnimatedBackground() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,69,0,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,69,0,0.05),transparent_50%)]" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(20,241,149,0.1),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(20,241,149,0.05),transparent_40%)]" />
			<AnimatedGrid />
			<ShootingStars />
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 dark:from-neutral-950 to-transparent pointer-events-none" />
		</div>
	);
}

export function BackgroundPaths({
	title = "Background Paths",
	subtitle,
}: {
	title?: string;
	subtitle?: string;
}) {
	const words = title.split(" ");

	return (
		<div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-950 selection:bg-orange-500/30">
			<div className="absolute inset-0 h-full w-full">
				<AnimatedBackground />
			</div>

			<div className="relative z-10 container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-[100vh] py-20">
				{/* Animated Logo Integration */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, ease: "easeOut" }}
					className="mb-16 relative flex items-center justify-center gap-12 md:gap-24"
				>
					{/* Central Glow */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-r from-orange-500/20 to-green-500/20 blur-3xl rounded-full pointer-events-none" />

					{/* Reddit Icon */}
					<motion.div
						animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
						transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
						className="relative group"
					>
						<div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full group-hover:bg-orange-500/50 transition-all duration-500" />
						<div className="w-20 h-20 md:w-32 md:h-32 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl p-5 border border-white/20 dark:border-white/10 z-10 relative flex items-center justify-center">
							<RedditIcon />
						</div>
						{/* Orbiting Satellite */}
						<motion.div 
							animate={{ rotate: 360 }}
							transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
							className="absolute inset-[-20%] border border-orange-500/20 rounded-full border-dashed"
						/>
					</motion.div>

					{/* Floating Dollars Animation */}
					<div className="absolute inset-0 pointer-events-none">
						{[0, 1, 2, 3, 4].map((i) => (
							<motion.div
								key={i}
								className="absolute top-1/2 left-1/2 flex items-center justify-center"
								initial={{ x: -100, y: 0, opacity: 0, scale: 0.5 }}
								animate={{ 
									x: [null, 100], 
									y: [null, (i % 2 === 0 ? -20 : 20)],
									opacity: [0, 1, 0],
									scale: [0.5, 1, 0.5],
									rotate: [0, 180]
								}}
								transition={{ 
									duration: 2, 
									repeat: Number.POSITIVE_INFINITY, 
									delay: i * 0.4,
									ease: "easeInOut"
								}}
							>
								<span className="text-green-400 dark:text-green-300 font-bold text-xl md:text-2xl drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
									$
								</span>
							</motion.div>
						))}
					</div>

					{/* Solana Icon */}
					<motion.div
						animate={{ y: [15, -15, 15], rotate: [2, -2, 2] }}
						transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
						className="relative group"
					>
						<div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full group-hover:bg-green-500/50 transition-all duration-500" />
						<div className="w-20 h-20 md:w-32 md:h-32 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl p-5 border border-white/20 dark:border-white/10 z-10 relative flex items-center justify-center">
							<BankIcon />
						</div>
						{/* Orbiting Satellite */}
						<motion.div 
							animate={{ rotate: -360 }}
							transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
							className="absolute inset-[-20%] border border-green-500/20 rounded-full border-dashed"
						/>
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
					className="max-w-5xl mx-auto relative z-20"
				>
					<h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter font-satoshi text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 leading-tight">
						{words.map((word, wordIndex) => (
							<span
								key={wordIndex}
								className="inline-block mr-4 last:mr-0"
							>
								{word.split("").map((letter, letterIndex) => (
									<motion.span
										key={`${wordIndex}-${letterIndex}`}
										initial={{ y: 100, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{
											delay:
												wordIndex * 0.1 +
												letterIndex * 0.03 + 0.5,
											type: "spring",
											stiffness: 150,
											damping: 25,
										}}
										className="inline-block"
									>
										{letter}
									</motion.span>
								))}
							</span>
						))}
					</h1>

					{subtitle && (
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8, duration: 0.8 }}
							className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed tracking-tight"
						>
							{subtitle}
						</motion.p>
					)}

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1.1, duration: 0.8 }}
						className="inline-block"
					>
						<Button
							size="lg"
							className="rounded-full px-8 py-6 text-lg font-medium 
                            bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 
                            text-white dark:text-black transition-all duration-300 
                            hover:scale-105 hover:shadow-lg hover:shadow-neutral-500/20"
						>
							Start Trading Now
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

