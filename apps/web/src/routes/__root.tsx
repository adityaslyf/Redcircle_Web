import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import {
	HeadContent,
	Outlet,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "Redcircle",
			},
			{
				name: "description",
				content: "Redcircle is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
				storageKey="vite-ui-theme"
			>
				<AuthProvider>
					<Navbar />
					<Outlet />
					<Toaster richColors />
				</AuthProvider>
			</ThemeProvider>
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
