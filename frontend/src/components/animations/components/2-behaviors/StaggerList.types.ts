import type { ReactNode } from "react";

/**
 * Stagger speed options — controls delay between sequential child entrances.
 * - fast: 40ms between children (dense lists, navigation)
 * - base: 80ms between children (general use)
 * - slow: 150ms between children (dramatic reveals, hero sections)
 */
export type StaggerSpeed = "fast" | "base" | "slow";

/**
 * Props for the StaggerList animation component.
 * Wraps children so each animates in sequentially with a cascading entrance.
 */
export interface StaggerListProps {
	// Content items to animate sequentially
	children: ReactNode;

	// Additional CSS classes passed to the motion container div
	className?: string;

	// Controls the delay between each child's entrance (default: "base" = 80ms)
	speed?: StaggerSpeed;
}
