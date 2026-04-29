import type { ReactNode } from "react";

/**
 * Props for the FadeIn animation component.
 * Animates children from opacity 0 → opacity 1 on mount.
 * The simplest animation — also serves as the reduced-motion fallback.
 */
export interface FadeInProps {
	// Content to animate
	children: ReactNode;

	// Additional CSS classes passed to the motion wrapper div
	className?: string;

	// Animation start delay in seconds (e.g. 0.1 = 100ms)
	delay?: number;

	// Override the default animation duration in seconds (default: 0.2s)
	duration?: number;
}
