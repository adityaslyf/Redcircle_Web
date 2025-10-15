import { BackgroundPaths } from "@/components/ui/background-paths";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return <BackgroundPaths title="Welcome to Redcircle" />;
}
