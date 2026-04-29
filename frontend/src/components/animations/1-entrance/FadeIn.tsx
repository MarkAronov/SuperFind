/**
 * FadeIn Component
 *
 * Animates children from opacity 0 → opacity 1 on mount.
 * The simplest and most universally safe animation — works for all use cases
 * and is also the graceful-degradation fallback for reduced-motion users.
 *
 * Props:
 * - delay: stagger individual elements in a sequence (e.g. delay={0.1})
 * - duration: override the default 200ms transition speed
 * - className: passed through to the motion wrapper div
 *
 * Usage:
 * ```tsx
 * <FadeIn>
 *   <MyContent />
 * </FadeIn>
 *
 * // With delay for sequential entrance
 * <FadeIn delay={0.2}>
 *   <MyContent />
 * </FadeIn>
 * ```
 */

import { motion } from "framer-motion";
import { useReducedMotion } from "../../../hooks/animations/useReducedMotion";
import { MOTION } from "../0-tokens/tokens";
import type { FadeInProps } from "./FadeIn.types";

export const FadeIn = ({
	children,
	className,
	delay = 0,
	duration,
}: FadeInProps) => {
	const { resolve } = useReducedMotion();

	// For fade: full and reduced are identical — both use opacity only.
	// We still call resolve() for consistency and future-proofing.
	const variants = resolve(
		MOTION.variants.fadeIn,
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

export type { FadeInProps } from "./FadeIn.types";
