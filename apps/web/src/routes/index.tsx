import { BackgroundPaths } from "@/components/ui/background-paths";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<>
			<SplashCursor />
			<BackgroundPaths title="Welcome to Redcircle" />
		</>
	);
}
