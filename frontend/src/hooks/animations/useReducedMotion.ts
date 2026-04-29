/**
 * ANIMATIONS: useReducedMotion Hook
 *
 * Detects the user's prefers-reduced-motion OS preference and provides
 * a `resolve()` helper to automatically pick between full and reduced animation variants.
 *
 * Wraps framer-motion's built-in useReducedMotion() for a consistent API
 * across the animation system.
 *
 * Graceful degradation strategy (project decision):
 * - "Reduced" means opacity-only animation (fade in/out)
 * - Transforms (slide, scale) are removed for reduced-motion users
 * - Animations are NOT fully disabled — they just simplify
 *
 * Usage:
 * ```tsx
 * const { resolve } = useReducedMotion();
 * const variants = resolve(MOTION.variants.slideUp, MOTION.variants.reducedFadeIn);
 * ```
 */

import type { Variants } from "framer-motion";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

export interface UseReducedMotionReturn {
	// Whether the user has requested reduced motion in their OS settings
	prefersReducedMotion: boolean;

	// Pick the appropriate variant based on reduced-motion preference.
	// Returns `reduced` when prefersReducedMotion is true, `full` otherwise.
	resolve: <T extends Variants>(full: T, reduced: T) => T;
}

export const useReducedMotion = (): UseReducedMotionReturn => {
	// framer-motion's hook returns null on server (SSR) — default to false (full motion)
	const prefersReducedMotion = useFramerReducedMotion() ?? false;

	// Select full or reduced variant based on user preference
	const resolve = <T extends Variants>(full: T, reduced: T): T => {
		return prefersReducedMotion ? reduced : full;
	};

	return { prefersReducedMotion, resolve };
};
