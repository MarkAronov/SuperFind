import type { ReactNode } from "react";

/**
 * Props for the ScaleIn animation component.
 * Animates children from scale 0.92 + opacity 0 → scale 1 + opacity 1.
 * Falls back to fade-only animation for prefers-reduced-motion users.
 */
export interface ScaleInProps {
	// Content to animate
	children: ReactNode;

	// Additional CSS classes passed to the motion wrapper div
	className?: string;

	// Animation start delay in seconds (e.g. 0.1 = 100ms)
	delay?: number;

	// Override the default animation duration in seconds (default: 0.2s)
	duration?: number;
}
