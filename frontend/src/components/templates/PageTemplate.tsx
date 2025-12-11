import { useMatches } from "@tanstack/react-router";
import type * as React from "react";
import { useEffect } from "react";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";

interface PageTemplateProps {
	children: React.ReactNode;
	/** Additional classes for the main content area */
	className?: string;
	/** Whether to include container and padding (default: true) */
	contained?: boolean;
	/** Page title to display in browser tab (will be prefixed with "SkillVector - ") */
	title?: string;
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
}: PageTemplateProps) {
	const matches = useMatches();
	const currentPath = matches[matches.length - 1]?.pathname || "/";

	useEffect(() => {
		// Use provided title, or auto-generate from path
		const pageTitle = title || pathToTitle(currentPath);
		document.title = `SkillVector - ${pageTitle}`;
	}, [title, currentPath]);

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main
				className={`flex-1 ${contained ? "container mx-auto px-4 py-12" : ""} ${className}`}
			>
				{children}
			</main>
			<Footer />
		</div>
	);
}
