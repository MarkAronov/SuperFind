import type * as React from "react";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";

interface PageTemplateProps {
	children: React.ReactNode;
	/** Additional classes for the main content area */
	className?: string;
	/** Whether to include container and padding (default: true) */
	contained?: boolean;
}

export function PageTemplate({
	children,
	className = "",
	contained = true,
}: PageTemplateProps) {
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
