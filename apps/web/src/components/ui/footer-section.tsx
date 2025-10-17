"use client";
import React from "react";
import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
	TwitterIcon,
	GithubIcon,
	LinkedinIcon,
	CircleIcon,
} from "lucide-react";

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: "Product",
		links: [
			{ title: "Features", href: "#features" },
			{ title: "Pricing", href: "#pricing" },
			{ title: "About", href: "#about" },
			{ title: "Contact", href: "#contact" },
		],
	},
	{
		label: "Company",
		links: [
			{ title: "FAQs", href: "/faqs" },
			{ title: "About Us", href: "/about" },
			{ title: "Privacy Policy", href: "/privacy" },
			{ title: "Terms of Services", href: "/terms" },
		],
	},
	{
		label: "Resources",
		links: [
			{ title: "Blog", href: "/blog" },
			{ title: "Changelog", href: "/changelog" },
			{ title: "Documentation", href: "/docs" },
			{ title: "Help", href: "/help" },
		],
	},
	{
		label: "Social Links",
		links: [
			{
				title: "Twitter",
				href: "https://twitter.com/adityaslyf",
				icon: TwitterIcon,
			},
			{
				title: "GitHub",
				href: "https://github.com/adityaslyf",
				icon: GithubIcon,
			},
			{
				title: "LinkedIn",
				href: "https://www.linkedin.com/in/aditya-varshney-089b33244/",
				icon: LinkedinIcon,
			},
		],
	},
];

export function Footer() {
	return (
		<footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
			<div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				<AnimatedContainer className="space-y-4">
					<p className="text-muted-foreground mt-8 text-sm md:mt-0">
						© {new Date().getFullYear()} Redcircle. All rights reserved.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs font-semibold">{section.label}</h3>
								<ul className="text-muted-foreground mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												target={link.href.startsWith("http") ? "_blank" : undefined}
												rel={
													link.href.startsWith("http")
														? "noopener noreferrer"
														: undefined
												}
												className="hover:text-foreground inline-flex items-center transition-all duration-300"
											>
												{link.icon && <link.icon className="me-1 size-4" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>["className"];
	children: ReactNode;
};

function AnimatedContainer({
	className,
	delay = 0.1,
	children,
}: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
			whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

