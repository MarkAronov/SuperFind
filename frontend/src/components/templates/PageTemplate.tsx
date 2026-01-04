import { useMatches } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Div } from "../atoms/Div";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";

interface PageTemplateProps {
	children: ReactNode;
	/** Additional classes for the main content area */
	className?: string;
	/** Whether to include container and padding (default: true) */
	contained?: boolean;
	/** Page title to display in browser tab (will be prefixed with "SkillVector - ") */
	title?: string;
	/** Max width variant for the main container when `contained` is true */
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
	/** When true, use responsive paddings (px-4 sm:px-6 lg:px-8 py-12). Set to false for custom padding control. */
	responsivePadding?: boolean;
	/** When true, wraps children in a Div with constrain prop. Use with contained={false} for manual content control. */
	constrain?: boolean;
	/** Custom max-width class when using constrain prop (e.g., "max-w-5xl") */
	constrainMaxWidth?: string;
}

// Helper to convert path to title
function pathToTitle(path: string): string {
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
}

export function PageTemplate({
	children,
	className = "",
	contained = true,
	title,
	maxWidth = "lg",
	responsivePadding = true,
	constrain = false,
	constrainMaxWidth = "max-w-5xl",
}: PageTemplateProps) {
	const matches = useMatches();
	const currentPath = matches[matches.length - 1]?.pathname || "/";

	useEffect(() => {
		// Use provided title, or auto-generate from path
		const pageTitle = title || pathToTitle(currentPath);
		document.title = `SkillVector - ${pageTitle}`;
	}, [title, currentPath]);

	// Map simple width variants to Tailwind max-width classes
	const maxWidthClass =
		maxWidth === "sm"
			? "max-w-3xl"
			: maxWidth === "md"
				? "max-w-4xl"
				: maxWidth === "lg"
					? "max-w-5xl"
					: maxWidth === "xl"
						? "max-w-6xl"
						: "max-w-7xl";

	const paddingClass = responsivePadding
		? "px-4 sm:px-6 lg:px-8 py-12"
		: "px-4 py-12";

	const content = constrain ? (
		<Div constrain maxWidthClass={constrainMaxWidth}>
			{children}
		</Div>
	) : (
		children
	);

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main
				className={`flex-1 ${
					contained ? `${paddingClass} ${maxWidthClass} mx-auto` : ""
				} ${className}`}
			>
				{content}
			</main>
			<Footer />
		</div>
	);
}
