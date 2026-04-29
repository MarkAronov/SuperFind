/**
 * ScaleIn Component
 *
 * Animates children from scale 0.92 + opacity 0 → scale 1 + opacity 1.
 * Creates a subtle "emerging from the background" feel.
 * Best for: modals, popovers, cards that appear on interaction.
 *
 * Reduced-motion behavior: falls back to fade-only (no scale transform).
 *
 * Usage:
 * ```tsx
 * <ScaleIn>
 *   <Card>Content that pops up</Card>
 * </ScaleIn>
 * ```
 */

import { motion } from "framer-motion";
import { useReducedMotion } from "../../../../hooks/animations/useReducedMotion";
import { MOTION } from "../../0-tokens/tokens";
import type { ScaleInProps } from "./ScaleIn.types";

export const ScaleIn = ({
	children,
	className,
	delay = 0,
	duration,
}: ScaleInProps) => {
	const { resolve } = useReducedMotion();

	// Use scale+fade for full motion, fade-only for reduced motion
	const variants = resolve(
		MOTION.variants.scaleIn,
		MOTION.variants.reducedFadeIn,
	);

	// Build transition: start with base, apply optional overrides
	const transition = {
		...MOTION.transition.base,
		...(duration !== undefined && { duration }),
		...(delay > 0 && { delay }),
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={variants}
			transition={transition}
			className={className}
		>
			{children}
		</motion.div>
	);
};

export type { ScaleInProps } from "./ScaleIn.types";
