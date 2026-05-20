/**
 * SlideIn Component
 *
 * Animates children from an offset position while fading in.
 * The element starts 20px in the given direction and translates to rest position.
 *
 * Reduced-motion behavior: falls back to fade-only (no transform) for users
 * with prefers-reduced-motion enabled in their OS.
 *
 * Props:
 * - direction: "up" | "down" | "left" | "right" (default: "up")
 * - delay: stagger in a sequence (e.g. delay={0.1})
 * - duration: override default 200ms speed
 * - className: passed through to the motion wrapper div
 *
 * Usage:
 * ```tsx
 * // Default — slides up (most common, for hero content)
 * <SlideIn><Heading>Title</Heading></SlideIn>
 *
 * // Horizontal slide for sidebar panels
 * <SlideIn direction="right"><Sidebar /></SlideIn>
 *
 * // Staggered sequence with delays
 * <SlideIn delay={0}>  <Heading /></SlideIn>
 * <SlideIn delay={0.1}><Text /></SlideIn>
 * <SlideIn delay={0.2}><Button /></SlideIn>
 * ```
 */

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/animations/useReducedMotion";
import type { SlideDirection } from "../0-tokens/SlideDirection";
import { MOTION } from "../0-tokens/tokens";
import type { SlideInProps } from "./SlideIn.types";

// Map each direction to its corresponding variant object
const directionVariantMap: Record<SlideDirection, Variants> = {
	up: MOTION.variants.slideUp,
	down: MOTION.variants.slideDown,
	left: MOTION.variants.slideLeft,
	right: MOTION.variants.slideRight,
};

export const SlideIn = ({
	children,
	className,
	direction = "up",
	delay = 0,
	duration,
}: SlideInProps) => {
	const { resolve } = useReducedMotion();

	// Use directional slide for full motion, fade-only for reduced motion
	const fullVariant = directionVariantMap[direction];
	const variants = resolve(fullVariant, MOTION.variants.reducedFadeIn);

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

export type { SlideDirection, SlideInProps } from "./SlideIn.types";
