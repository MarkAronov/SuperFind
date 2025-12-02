import "../src/index.css";
import type { Decorator } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	RouterProvider,
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import * as ReactDOM from "react-dom";

// Polyfill: Storybook and some add-ons expect ReactDOM.unmountComponentAtNode
// which does not exist on the React 18/19 client root API. Provide a
// compatibility shim so existing addons and Storybook's preview work.
const dom = ReactDOM as unknown as {
	unmountComponentAtNode?: (c: Element | null) => void;
	createRoot?: (...args: unknown[]) => unknown;
};
if (!dom.unmountComponentAtNode) {
	dom.unmountComponentAtNode = (container: Element | null) => {
		if (!container) return;
		const anyContainer = container as unknown as {
			_reactRootContainer?:
				| { unmount?: (...args: unknown[]) => unknown }
				| undefined;
			_reactRoot?: { unmount?: (...args: unknown[]) => unknown } | undefined;
		};
		const root = anyContainer._reactRootContainer || anyContainer._reactRoot;
		if (root && typeof root.unmount === "function") {
			try {
				root.unmount();
				return;
			} catch {
				// ignore
			}
		}
		try {
			// @ts-ignore
			if (typeof dom.createRoot === "function") {
			}
		} catch {
			// ignore
		}
	};
}

// Create a QueryClient for React Query
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
});

// Create a storybook-specific router that renders children in a route
let storyContent: ReactNode = null;

const rootRoute = createRootRoute({
	component: () => <Outlet />,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => <>{storyContent}</>,
	validateSearch: (search: Record<string, unknown>): { q?: string } => ({
		q: (search.q as string) || undefined,
	}),
});

// Add catch-all routes for common paths used in Link components
const catchAllRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "$",
	component: () => <>{storyContent}</>,
});

const routeTree = rootRoute.addChildren([indexRoute, catchAllRoute]);

const createStorybookRouter = () => {
	return createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries: ["/"] }),
	});
};

// Decorator to wrap stories with Router and QueryClient providers
const withProviders: Decorator = (Story) => {
	// Set the story content that will be rendered inside the router
	storyContent = <Story />;
	const router = createStorybookRouter();

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
};

export const decorators = [withProviders];
export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: { expanded: true },
};
export const tags = ["autodocs"];
