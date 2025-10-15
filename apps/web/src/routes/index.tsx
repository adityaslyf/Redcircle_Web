import { BackgroundPaths } from "@/components/ui/background-paths";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { AnimatedFooter } from "@/components/ui/animated-footer";
import Navbar from "@/components/Navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="relative flex min-h-screen flex-col">
			<SplashCursor />
			<Navbar />
			<BackgroundPaths title="Welcome to Redcircle" />
			<AnimatedFooter />
		</div>
	);
}
