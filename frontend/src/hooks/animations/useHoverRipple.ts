import type React from "react";
import { useCallback, useState } from "react";

/**
 * Return type for the useHoverRipple hook.
 * Spread onMouseEnter/onMouseLeave onto the interactive element,
 * then use rippleX/rippleY + isHovering to drive the AnimatePresence overlay.
 *
 * rippleX/Y are element-relative percentages (0–100) of where the mouse entered.
 * Use them as the clip-path origin: circle(0% at rippleX% rippleY%).
 */
export type HoverRippleState = {
	/** Horizontal entry position as % of element width (0–100) */
	rippleX: number;
	/** Vertical entry position as % of element height (0–100) */
	rippleY: number;
	/** True while the mouse is over the element — drives AnimatePresence */
	isHovering: boolean;
	/** Attach to the element's onMouseEnter prop */
	onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
	/** Attach to the element's onMouseLeave prop */
	onMouseLeave: () => void;
};

/**
 * useHoverRipple — Tracks mouse entry coordinates for clipPath ripple overlays.
 *
 * Computes the mouse position (as percentages) relative to the target element's
 * bounding box on mouse enter. These percentages become the ripple origin for a
 * circle() clip-path, so the reveal naturally expands from the entry edge/corner.
 *
 * @example
 * const { rippleX, rippleY, isHovering, onMouseEnter, onMouseLeave } = useHoverRipple();
 *
 * <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="relative overflow-hidden">
 *   <AnimatePresence>
 *     {isHovering && (
 *       <motion.div
 *         className="absolute inset-0 pointer-events-none"
 *         initial={{ clipPath: `circle(0% at ${rippleX}% ${rippleY}%)` }}
 *         animate={{ clipPath: `circle(150% at ${rippleX}% ${rippleY}%)` }}
 *         exit={{ opacity: 0 }}
 *       />
 *     )}
 *   </AnimatePresence>
 * </div>
 */
export const useHoverRipple = (): HoverRippleState => {
	// Whether the mouse is currently hovering the target element
	const [isHovering, setIsHovering] = useState(false);

	// Mouse entry position in element-relative percentages — default centre (50%)
	// so the circle comes from the middle if no mouse event fires (touch fallback)
	const [rippleX, setRippleX] = useState(50);
	const [rippleY, setRippleY] = useState(50);

	// Capture mouse entry coordinates and convert to element-relative percentages.
	// All three state updates are batched by React into a single re-render so the
	// ripple overlay mounts with the correct origin in the same frame.
	const onMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();

		// Clamp to [0, 100] to guard against rounding at element edges
		const x = Math.min(
			100,
			Math.max(0, ((e.clientX - rect.left) / rect.width) * 100),
		);
		const y = Math.min(
			100,
			Math.max(0, ((e.clientY - rect.top) / rect.height) * 100),
		);

		setRippleX(Math.round(x));
		setRippleY(Math.round(y));
		setIsHovering(true);
	}, []);

	// Clear hovered state — triggers the AnimatePresence exit animation on the overlay
	const onMouseLeave = useCallback(() => {
		setIsHovering(false);
	}, []);

	return { rippleX, rippleY, isHovering, onMouseEnter, onMouseLeave };
};
