import type { ReactNode } from "react";
import type { SlideDirection } from "../0-tokens/SlideDirection";

/**
 * Props for the SlideIn animation component.
 * Animates children from an offset position + opacity 0 → rest position + opacity 1.
 * Falls back to fade-only animation for prefers-reduced-motion users.
 */
export interface SlideInProps {
	// Content to animate
	children: ReactNode;

	// Additional CSS classes passed to the motion wrapper div
	className?: string;

	// Direction the element enters from (default: "up" — slides upward into position)
	direction?: SlideDirection;

	// Animation start delay in seconds (e.g. 0.1 = 100ms)
	delay?: number;

	// Override the default animation duration in seconds (default: 0.2s)
	duration?: number;
}

export type { SlideDirection };
