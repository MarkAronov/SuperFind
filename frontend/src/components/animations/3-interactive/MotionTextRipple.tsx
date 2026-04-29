import { AnimatePresence, motion } from "framer-motion";
import type React from "react";

import { cn } from "@/lib/utils";
import { useHoverRipple } from "../../../hooks/animations/useHoverRipple";
import { MOTION } from "../0-tokens/tokens";

export type MotionTextRippleProps = {
	/** Content to render — same node tree is duplicated for the color overlay */
	children: React.ReactNode;
	/** CSS color value that the overlay text resolves to on hover */
	hoverColor: string;
	/** Extra classes for the outer wrapper span */
	className?: string;
};

/**
 * MotionTextRipple — clipPath color-change ripple for text/inline content.
 *
 * Renders children twice:
 *  1. Base layer  — always visible, inherits the parent's text color.
 *  2. Color layer — mounts on hover via AnimatePresence; uses clipPath circle()
 *     that expands from the mouse entry edge, revealing hoverColor underneath.
 *
 * The effect is a smooth "color wipe" that flows in from wherever the cursor arrived.
 * On mouse-leave the overlay fades out cleanly, restoring the original color.
 *
 * Screen-readers only see the base layer; the overlay is aria-hidden.
 *
 * @example
 * <MotionTextRipple hoverColor={MOTION.hover.link}>
 *   Visit GitHub
 * </MotionTextRipple>
 */
export const MotionTextRipple = ({
	children,
	hoverColor,
	className,
}: MotionTextRippleProps) => {
	// Track mouse entry position for the ripple origin
	const { rippleX, rippleY, isHovering, onMouseEnter, onMouseLeave } =
		useHoverRipple();

	return (
		<>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: purely visual animation wrapper — mouse events drive clip-path ripple only; actual interactive semantics live in children */}
			<span
				// inline-block: gives the span a definite box so absolute inset-0 on overlay is anchored
				// relative: establishes stacking context for the absolute overlay layer
				// role="presentation": semantics come from children (links, buttons); this span adds no meaning
				role="presentation"
				className={cn("inline-block relative", className)}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				{children}

				<AnimatePresence>
					{isHovering && (
						<motion.span
							// Overlay is purely decorative — screen-readers skip it entirely
							aria-hidden="true"
							// Fills the parent box exactly so colored text overlaps the base layer
							// pointer-events-none: parent span handles all mouse events
							className="absolute inset-0 pointer-events-none"
							// Runtime CSS var string applied via inline style — Tailwind can't resolve this at build time
							style={{ color: hoverColor }}
							// Circle grows from mouse entry point, revealing the hover color beneath
							initial={{
								clipPath: `circle(0% at ${rippleX}% ${rippleY}%)`,
							}}
							animate={{
								clipPath: `circle(150% at ${rippleX}% ${rippleY}%)`,
							}}
							// Fade out the overlay when mouse leaves
							exit={{ opacity: 0 }}
							transition={{
								clipPath: MOTION.ripple.enter,
								opacity: MOTION.ripple.exit,
							}}
						>
							{children}
						</motion.span>
					)}
				</AnimatePresence>
			</span>
		</>
	);
};
