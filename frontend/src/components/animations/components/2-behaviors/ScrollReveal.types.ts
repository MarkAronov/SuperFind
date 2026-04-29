import type { ReactNode } from "react";
import type { SlideDirection } from "../../0-tokens/SlideDirection";

/**
 * Props for the ScrollReveal component.
 * Triggers an entrance animation when the element enters the viewport.
 */
export interface ScrollRevealProps {
	// Content to reveal
	children: ReactNode;

	// Additional CSS classes for the motion wrapper div
	className?: string;

	// Direction of the entrance animation (default: "up").
	// "none" applies fade-only with no directional movement.
	direction?: SlideDirection | "none";

	// Fraction of the element that must be in view before triggering (0–1).
	// Default: 0.1 (10% visible triggers the animation)
	threshold?: number;
}
