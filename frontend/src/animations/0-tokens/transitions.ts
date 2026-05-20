/**
 * ANIMATIONS: CSS Transition Tokens
 *
 * Migrated from 1-ions/transitions.ts.
 * Raw CSS transition strings for inline styles and non-Tailwind contexts.
 * Use these when you need CSS transition values as strings (e.g., style prop, custom CSS-in-JS).
 *
 * Duration Scale:
 * - 75ms: Instant feedback (checkboxes, switches)
 * - 100ms: Quick transitions (hover states, tooltips)
 * - 150ms: Fast animations (dropdowns, menus)
 * - 200ms: Standard transitions (most UI elements)
 * - 300ms: Noticeable motion (modals, panels)
 * - 500ms: Deliberate animations (page transitions)
 * - 700ms: Emphasized motion (loading states)
 * - 1000ms: Long-form animations (intro sequences)
 *
 * Timing Functions:
 * - linear: Constant speed (loading bars, spinners)
 * - in: Accelerate (cubic-bezier 0.4, 0, 1, 1) - Exit animations
 * - out: Decelerate (cubic-bezier 0, 0, 0.2, 1) - Entrance animations
 * - inOut: Smooth both ends (cubic-bezier 0.4, 0, 0.2, 1) - Most UI
 *
 * Preset Combinations:
 * - fast: 150ms ease-in-out - Quick feedback (buttons, links)
 * - base: 200ms ease-in-out - Standard UI (cards, dropdowns)
 * - slow: 300ms ease-in-out - Noticeable motion (modals)
 * - slower: 500ms ease-in-out - Deliberate animations (page changes)
 */

export const transitions = {
	/**
	 * Duration values in milliseconds
	 * Base timing values for transitions and animations
	 */
	duration: {
		75: "75ms", // 75ms - Instant feedback (toggles)
		100: "100ms", // 100ms - Quick transitions (hover)
		150: "150ms", // 150ms - Fast animations (dropdowns)
		200: "200ms", // 200ms - Standard transitions (default)
		300: "300ms", // 300ms - Noticeable motion (modals)
		500: "500ms", // 500ms - Deliberate animations (pages)
		700: "700ms", // 700ms - Emphasized motion (loading)
		1000: "1000ms", // 1000ms - Long-form animations (intros)
	},

	/**
	 * Timing function values (easing curves)
	 * Controls acceleration/deceleration of animations
	 */
	timing: {
		linear: "linear", // Constant speed
		in: "cubic-bezier(0.4, 0, 1, 1)", // Accelerate (exit)
		out: "cubic-bezier(0, 0, 0.2, 1)", // Decelerate (entrance)
		inOut: "cubic-bezier(0.4, 0, 0.2, 1)", // Smooth both ends (natural)
	},

	/**
	 * Common transition presets
	 * Pre-combined duration + timing for convenience
	 */
	presets: {
		fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)", // Quick feedback
		base: "200ms cubic-bezier(0.4, 0, 0.2, 1)", // Standard UI
		slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)", // Noticeable motion
		slower: "500ms cubic-bezier(0.4, 0, 0.2, 1)", // Deliberate animations
	},
} as const;

/**
 * Type helpers for transition values
 */
export type TransitionDuration = keyof typeof transitions.duration;
export type TransitionTiming = keyof typeof transitions.timing;
