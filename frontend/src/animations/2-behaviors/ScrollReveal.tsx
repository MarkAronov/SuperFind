import type { Variants } from "framer-motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/animations/useReducedMotion";
// Shared direction type
import type { SlideDirection } from "../0-tokens/SlideDirection";
// Internal tokens and hooks
import { MOTION } from "../0-tokens/tokens";
// Component types
import type { ScrollRevealProps } from "./ScrollReveal.types";

// Re-export types for consumers
export type { ScrollRevealProps } from "./ScrollReveal.types";

/**
 * Maps each direction (plus "none") to its corresponding slide variant.
 * "none" triggers a fade-only entrance with no directional movement.
 */
const directionVariantMap: Record<SlideDirection | "none", Variants> = {
	up: MOTION.variants.slideUp,
	down: MOTION.variants.slideDown,
	left: MOTION.variants.slideLeft,
	right: MOTION.variants.slideRight,

	// "none" falls back to the basic fade — no translation
	none: MOTION.variants.fadeIn,
};

/**
 * ScrollReveal
 *
 * Animates its children into view when the element enters the viewport.
 * Uses framer-motion's `useInView` for intersection detection.
 *
 * - Triggers once by default (animates in, stays visible)
 * - Respects `prefers-reduced-motion` (opacity-only fallback, no movement)
 * - direction: which way the element slides in from (default: "up")
 * - threshold: how much of the element must be visible before triggering
 *
 * @example
 * <ScrollReveal direction="up" threshold={0.15}>
 *   <Card>visible on scroll</Card>
 * </ScrollReveal>
 */
export const ScrollReveal = ({
	children,
	className,
	direction = "up",
	threshold = 0.1,
}: ScrollRevealProps) => {
	// Ref attached to the motion wrapper — useInView observes this element
	const ref = useRef<HTMLDivElement>(null);

	// Trigger animation once when threshold of element is in viewport
	const isInView = useInView(ref, { once: true, amount: threshold });

	// Resolve full vs. reduced-motion variant
	const { resolve } = useReducedMotion();
	const fullVariant = directionVariantMap[direction];
	const variants = resolve(fullVariant, MOTION.variants.reducedFadeIn);

	return (
		<motion.div
			ref={ref}
			// Drive visibility via animate — toggled by isInView
			initial="hidden"
			animate={isInView ? "visible" : "hidden"}
			variants={variants}
			transition={MOTION.transition.base}
			className={className}
		>
			{children}
		</motion.div>
	);
};
