import { StaggeredMenu } from "../StaggeredMenu";

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
	return (
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
					className="font-1797 uppercase"
				>
					Redcircle
				</span>
			}
			menuButtonColor="#ffffff"
			openMenuButtonColor="#ffffff"
			accentColor="#3b82f6"
			changeMenuColorOnOpen={false}
			isFixed={true}
		/>
	);
}