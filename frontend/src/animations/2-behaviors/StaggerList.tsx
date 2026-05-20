/**
 * StaggerList Component
 *
 * Wraps a list of children so each one animates in sequentially,
 * creating a cascading entrance effect.
 *
 * How it works:
 * The container becomes a framer-motion orchestrator with `staggerChildren`.
 * Each direct child is wrapped in a motion.div that inherits the parent's
 * "hidden"/"visible" state and applies its own slide-up + fade entrance.
 *
 * Best for:
 * - Navigation link lists
 * - Feature card grids
 * - Step-by-step lists
 * - Any repeated items that should entrance sequentially
 *
 * Usage:
 * ```tsx
 * <StaggerList>
 *   <Card>Feature 1</Card>
 *   <Card>Feature 2</Card>
 *   <Card>Feature 3</Card>
 * </StaggerList>
 *
 * // Faster stagger for dense lists
 * <StaggerList speed="fast" className="flex flex-col gap-2">
 *   {navItems.map(item => <NavItem key={item.id} {...item} />)}
 * </StaggerList>
 * ```
 */

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { Children } from "react";
import { MOTION } from "../0-tokens/tokens";
import type { StaggerListProps, StaggerSpeed } from "./StaggerList.types";

// Map speed name to the corresponding container stagger variant
const speedVariantMap: Record<StaggerSpeed, Variants> = {
	fast: MOTION.stagger.containerFast, // 40ms between children
	base: MOTION.stagger.container, // 80ms between children
	slow: MOTION.stagger.containerSlow, // 150ms between children
};

export const StaggerList = ({
	children,
	className,
	speed = "base",
}: StaggerListProps) => {
	// Select container variant based on desired stagger speed
	const containerVariant = speedVariantMap[speed];

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariant}
			className={className}
		>
			{Children.map(children, (child, index) => (
				// Each child inherits the parent's animation state and staggers in
				<motion.div
					// biome-ignore lint/suspicious/noArrayIndexKey: index is stable here (static list)
					key={index}
					variants={MOTION.stagger.item}
				>
					{child}
				</motion.div>
			))}
		</motion.div>
	);
};

export type { StaggerListProps, StaggerSpeed } from "./StaggerList.types";
