import { BackgroundPaths } from "@/components/ui/background-paths";
import { SplashCursor } from "@/components/ui/splash-cursor";
import Navbar from "@/components/Navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<>
			<SplashCursor />
			<Navbar />
			<BackgroundPaths title="Welcome to Redcircle" />
		</>
	);
}
