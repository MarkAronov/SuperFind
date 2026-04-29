/**
 * ANIMATIONS: Tailwind Animation Utilities
 *
 * Migrated from 1-ions/animation.ts.
 * Provides Tailwind CSS class strings for animation, duration, easing, and keyframes.
 * Use these for CSS-driven animations (no JavaScript required).
 *
 * Duration Scale:
 * - instant: 0ms - Immediate changes with no transition
 * - fast: 100ms - Quick feedback (hover states, tooltips)
 * - normal: 200ms - Standard transitions (buttons, dropdowns)
 * - moderate: 300ms - Noticeable motion (modals, panels)
 * - slow: 500ms - Deliberate animations (page transitions)
 * - slower: 700ms - Emphasized motion (loading states)
 * - slowest: 1000ms - Long-form animations (intro sequences)
 *
 * Timing Functions:
 * - linear: Constant speed throughout (progress bars, spinners)
 * - in: Accelerate from slow start (exit animations)
 * - out: Decelerate to slow end (entrance animations)
 * - inOut: Accelerate then decelerate (most UI transitions)
 *
 * Keyframe Animations:
 * - spin: 360° rotation loop (loading spinners)
 * - ping: Scale pulse with fade (notification indicators)
 * - pulse: Opacity fade in/out (breathing effect)
 * - bounce: Vertical bounce motion (draw attention)
 */

export const ANIMATION = {
	/**
	 * Duration tokens for transition timing
	 * Maps semantic names to Tailwind duration utilities
	 */
	DURATION: {
		instant: "duration-0", // 0ms - No transition
		fast: "duration-100", // 100ms - Quick feedback
		normal: "duration-200", // 200ms - Standard UI transitions
		moderate: "duration-300", // 300ms - Noticeable motion
		slow: "duration-500", // 500ms - Deliberate animations
		slower: "duration-700", // 700ms - Emphasized motion
		slowest: "duration-1000", // 1000ms - Long-form animations
	},

	/**
	 * Timing function tokens for easing curves
	 * Controls acceleration/deceleration behavior
	 */
	TIMING: {
		linear: "ease-linear", // Constant speed (mechanical motion)
		in: "ease-in", // Accelerate from start (exits)
		out: "ease-out", // Decelerate to end (entrances)
		inOut: "ease-in-out", // Smooth start and end (natural motion)
	},

	/**
	 * Keyframe animation tokens for looping effects
	 * Pre-defined animation patterns from Tailwind
	 */
	KEYFRAME: {
		spin: "animate-spin", // 360° rotation (1s linear infinite)
		ping: "animate-ping", // Scale + fade pulse (1s cubic-bezier infinite)
		pulse: "animate-pulse", // Opacity fade (2s cubic-bezier infinite)
		bounce: "animate-bounce", // Vertical bounce (1s infinite)
	},
} as const;
