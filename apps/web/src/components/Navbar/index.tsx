import BubbleMenu from "../BubbleMenu";

const items = [
	{
		label: "home",
		href: "/",
		ariaLabel: "Home",
		rotation: -8,
		hoverStyles: { bgColor: "#3b82f6", textColor: "#ffffff" },
	},
	{
		label: "features",
		href: "#features",
		ariaLabel: "Features",
		rotation: 8,
		hoverStyles: { bgColor: "#10b981", textColor: "#ffffff" },
	},
	{
		label: "about",
		href: "#about",
		ariaLabel: "About",
		rotation: 8,
		hoverStyles: { bgColor: "#f59e0b", textColor: "#ffffff" },
	},
	{
		label: "pricing",
		href: "#pricing",
		ariaLabel: "Pricing",
		rotation: -8,
		hoverStyles: { bgColor: "#ef4444", textColor: "#ffffff" },
	},
	{
		label: "contact",
		href: "#contact",
		ariaLabel: "Contact",
		rotation: 8,
		hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" },
	},
];

export default function Navbar() {
	return (
		<BubbleMenu
			logo={
				<span
					style={{
						fontWeight: 700,
						fontSize: "1.25rem",
						letterSpacing: "-0.02em",
					}}
				>
					Redcircle
				</span>
			}
			items={items}
			menuAriaLabel="Toggle navigation"
			menuBg="#ffffff"
			menuContentColor="#111111"
			useFixedPosition={true}
			animationEase="back.out(1.5)"
			animationDuration={0.5}
			staggerDelay={0.12}
		/>
	);
}