import { StaggeredMenu } from "../StaggeredMenu";
import { useEffect, useState } from "react";

const items = [
	{
		label: "Home",
		link: "/",
		ariaLabel: "Go to home page",
	},
	{
		label: "Features",
		link: "#features",
		ariaLabel: "View features",
	},
	{
		label: "About",
		link: "#about",
		ariaLabel: "Learn about us",
	},
	{
		label: "Pricing",
		link: "#pricing",
		ariaLabel: "View pricing",
	},
	{
		label: "Contact",
		link: "#contact",
		ariaLabel: "Contact us",
	},
];

const socialItems = [
	{ label: "Twitter", link: "https://twitter.com/adityaslyf" },
	{ label: "GitHub", link: "https://github.com/adityaslyf" },
	{ label: "LinkedIn", link: "https://www.linkedin.com/in/aditya-varshney-089b33244/" },
];

export default function Navbar() {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			const heroHeight = window.innerHeight; // Hero section is min-h-screen
			const scrollPosition = window.scrollY;
			
			// Hide navbar after scrolling past hero section
			setIsVisible(scrollPosition < heroHeight);
		};

		// Check initial scroll position
		handleScroll();

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
			style={{
				opacity: isVisible ? 1 : 0,
				pointerEvents: isVisible ? "auto" : "none",
				transform: isVisible ? "translateY(0)" : "translateY(-20px)",
			}}
		>
			<StaggeredMenu
				position="right"
				colors={["#0a0a0a", "#1a1a1a"]}
				items={items}
				socialItems={socialItems}
				displaySocials={true}
				displayItemNumbering={true}
				logoComponent={
					<span
						style={{
							fontWeight: 700,
							fontSize: "1.5rem",
							letterSpacing: "-0.03em",
							color: "#ffffff",
						}}
						className="font-satoshi"
					>
						Redcircle
					</span>
				}
				menuButtonColor="#ffffff"
				openMenuButtonColor="#ffffff"
				accentColor="#3b82f6"
				changeMenuColorOnOpen={false}
				isFixed={false}
			/>
		</div>
	);
}