import { useMatches } from "@tanstack/react-router";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { SPACING } from "../1-ions/spacing";
import { Div } from "../2-atoms/Div";
import { ScrollArea } from "../2-atoms/ScrollArea";
import { Footer } from "../4-organisms/Footer";
import { Header } from "../4-organisms/Header";
import { AnimatedRoute } from "../animations/4-route/AnimatedRoute";
import type { PageTemplateProps } from "./PageTemplate.types";

/**
 * PageTemplate Component
 *
 * Flexible page wrapper providing consistent layout structure across the application.
 * Handles Header/Footer, width constraints, padding, and document title management.
 *
 * Width Control:
 * - Default: lg (1024px) - Standard content pages
 * - API/Docs: 2xl (1280px) - Wide layouts with sidebars
 * - Articles: md (896px) - Optimal reading width
 * - Full-width: "full" - No max-width constraint
 *
 * Padding Control:
 * - Default: responsive - Adapts padding to screen size
 * - Compact: Less vertical space for dense layouts
 * - None: No padding (for custom layouts)
 *
 * Common Usage:
 * - Standard: <PageTemplate title="Page Name">{content}</PageTemplate>
 * - Wide: <PageTemplate title="Docs" maxWidth="2xl">{content}</PageTemplate>
 * - Custom: <PageTemplate contained={false}>{customLayout}</PageTemplate>
 */

// Helper to convert path to title
const pathToTitle = (path: string): string => {
	if (path === "/") return "Search";

	// Remove leading slash and convert kebab-case to Title Case
	return path
		.slice(1)
		.split("/")
		.map((segment) =>
			segment
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" "),
		)
		.join(" - ");
};

export const PageTemplate = ({
	children,
	className = "",
	contained = true,
	title,
	maxWidth = "lg",
	paddingVariant = "responsive",
	constrain = false,
	constrainMaxWidth = "max-w-5xl",
}: PageTemplateProps) => {
	const matches = useMatches();
	const currentPath = matches[matches.length - 1]?.pathname || "/";

	useEffect(() => {
		// Use provided title, or auto-generate from path
		const pageTitle = title || pathToTitle(currentPath);
		document.title = `SkillVector - ${pageTitle}`;
	}, [title, currentPath]);

	// Map width variants to Tailwind max-width classes
	const maxWidthClass =
		maxWidth === "sm"
			? "max-w-3xl"
			: maxWidth === "md"
				? "max-w-4xl"
				: maxWidth === "lg"
					? "max-w-5xl"
					: maxWidth === "xl"
						? "max-w-6xl"
						: maxWidth === "2xl"
							? "max-w-7xl"
							: ""; // "full" = no max-width

	// Map padding variants to classes
	const paddingClass =
		paddingVariant === "responsive"
			? `${SPACING.PADDING_X.responsive.sm} py-12`
			: paddingVariant === "compact"
				? `${SPACING.PADDING_X.md} ${SPACING.PADDING_Y.xl}`
				: ""; // "none" = no padding

	const content = constrain ? (
		<Div constrain maxWidthClass={constrainMaxWidth}>
			{children}
		</Div>
	) : (
		children
	);

	return (
		// h-screen container gives ScrollArea a bounded height so it can overflow,
		// enabling the custom Radix scrollbar for the full page
		<Div className={cn("h-screen flex flex-col")}>
			<ScrollArea className="flex-1">
				{/* Flex wrapper ensures footer sticks to bottom on short pages */}
				<Div className="min-h-screen flex flex-col">
					{/* Header inside ScrollArea so sticky positioning works
					    within the scroll viewport — backdrop-filter can blur
					    content scrolling behind it (glass effect) */}
					<Header />
					{/* AnimatedRoute wraps only <main> so Header/Footer are stable during transitions */}
					<AnimatedRoute>
						<main
							className={cn(
								// Flex grow pushes footer to bottom on short pages
								"flex-1",
								contained && paddingClass,
								contained && maxWidthClass,
								contained && "mx-auto",
								className,
							)}
						>
							{content}
						</main>
					</AnimatedRoute>
					<Footer />
				</Div>
			</ScrollArea>
		</Div>
	);
};
