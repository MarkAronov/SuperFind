import type { ReactNode } from "react";

/**
 * `speed` controls how quickly children stagger in sequence:
 * - "fast": 40ms between each child (dense lists)
 * - "base": 80ms between each child (standard cards, nav items)
 * - "slow": 150ms between each child (hero sections, feature highlights)
 */
export type StaggerSpeed = "fast" | "base" | "slow";

/**
 * Props for the StaggerList component.
 * Wraps children so each enters sequentially with a stagger delay.
 */
export interface StaggerListProps {
	// Elements to animate in staggered sequence.
	// Each direct child gets wrapped in a motion element with slide-up + fade.
	children: ReactNode;

	// Additional CSS classes for the container div
	className?: string;

	// Controls timing between each child's entrance (default: "base" = 80ms)
	speed?: StaggerSpeed;
}
