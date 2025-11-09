import { StaggeredMenu } from "../StaggeredMenu";
import { useAuth } from "../../contexts/AuthContext";
import UserProfile from "../UserProfile";

const items = [
	{
		label: "Home",
		link: "/",
		ariaLabel: "Go to home page",
	},
	{
		label: "Dashboard",
		link: "/dashboard",
		ariaLabel: "Open dashboard",
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
	{
		label: "Sign In",
		link: "/signin",
		ariaLabel: "Sign in to your account",
	},
];

const socialItems = [
	{ label: "Twitter", link: "https://twitter.com/adityaslyf" },
	{ label: "GitHub", link: "https://github.com/adityaslyf" },
	{ label: "LinkedIn", link: "https://www.linkedin.com/in/aditya-varshney-089b33244/" },
];

export default function Navbar() {
	const { isAuthenticated } = useAuth();

	// Dynamically build menu items based on auth status
	const menuItems = isAuthenticated
		? [
				{
					label: "Home",
					link: "/",
					ariaLabel: "Go to home page",
				},
				{
					label: "Dashboard",
					link: "/dashboard",
					ariaLabel: "Open dashboard",
				},
				{
					label: "Launch",
					link: "/launch",
					ariaLabel: "Launch a post",
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
					label: "Contact",
					link: "#contact",
					ariaLabel: "Contact us",
				},
		  ]
		: items;

	return (
		<>
			<StaggeredMenu
				position="right"
				colors={["#0a0a0a", "#1a1a1a"]}
				items={menuItems}
				socialItems={socialItems}
				displaySocials={true}
				displayItemNumbering={true}
				logoComponent={
					<div className="flex items-center justify-between w-full gap-4">
						<span
							style={{
								fontWeight: 800,
								fontSize: "1.25rem",
								letterSpacing: "-0.02em",
								color: "#ffffff",
							}}
						>
							Redcircle
						</span>
						{isAuthenticated && <UserProfile />}
					</div>
				}
				menuButtonColor="#ffffff"
				openMenuButtonColor="#ffffff"
				accentColor="#3b82f6"
				changeMenuColorOnOpen={false}
				isFixed={true}
			/>
		</>
	);
}