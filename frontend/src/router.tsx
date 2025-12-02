import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import { lazy } from "react";
import { SearchPage } from "./components/pages/SearchPage";

// Lazy load pages for code splitting
// SearchPage is eagerly loaded since it's the main landing page
const AboutPage = lazy(() => import("./components/pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ChangelogPage = lazy(() => import("./components/pages/ChangelogPage").then(m => ({ default: m.ChangelogPage })));
const ContactPage = lazy(() => import("./components/pages/ContactPage").then(m => ({ default: m.ContactPage })));
const CookiesPage = lazy(() => import("./components/pages/CookiesPage").then(m => ({ default: m.CookiesPage })));
const FeaturesPage = lazy(() => import("./components/pages/FeaturesPage").then(m => ({ default: m.FeaturesPage })));
const HowItWorksPage = lazy(() => import("./components/pages/HowItWorksPage").then(m => ({ default: m.HowItWorksPage })));
const IntegrationsPage = lazy(() => import("./components/pages/IntegrationsPage").then(m => ({ default: m.IntegrationsPage })));
const PrivacyPage = lazy(() => import("./components/pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const SupportPage = lazy(() => import("./components/pages/SupportPage").then(m => ({ default: m.SupportPage })));
const TermsPage = lazy(() => import("./components/pages/TermsPage").then(m => ({ default: m.TermsPage })));
// ApiPage is the largest chunk (Scalar) - definitely lazy load
const ApiPage = lazy(() => import("./pages/ApiPage").then(m => ({ default: m.ApiPage })));

// Root route
const rootRoute = createRootRoute();

// Define routes
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: SearchPage,
	validateSearch: (search: Record<string, unknown>): { q?: string } => ({
		q: (search.q as string) || undefined,
	}),
});

const featuresRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/features",
	component: FeaturesPage,
});

const apiRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/api",
	component: ApiPage,
});

const contactRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/contact",
	component: ContactPage,
});

// Placeholder routes
const aboutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/about",
	component: AboutPage,
});

const howItWorksRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/how-it-works",
	component: HowItWorksPage,
});

const integrationsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/integrations",
	component: IntegrationsPage,
});

const supportRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/support",
	component: SupportPage,
});

const changelogRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/changelog",
	component: ChangelogPage,
});

const privacyRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/privacy",
	component: PrivacyPage,
});

const termsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/terms",
	component: TermsPage,
});

const cookiesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/cookies",
	component: CookiesPage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
	indexRoute,
	featuresRoute,
	apiRoute,
	contactRoute,
	aboutRoute,
	howItWorksRoute,
	integrationsRoute,
	supportRoute,
	changelogRoute,
	privacyRoute,
	termsRoute,
	cookiesRoute,
]);

// Create router
export const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
