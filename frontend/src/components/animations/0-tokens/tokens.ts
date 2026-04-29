/**
 * ANIMATIONS: Motion Tokens
 *
 * Framer-motion variant objects, transition configs, stagger orchestration,
 * and page transition presets. These are the JS-driven animation primitives.
 *
 * Structure:
 * - MOTION.variants  — Enter/exit states for framer-motion elements
 * - MOTION.transition — Pre-built transition timing configs
 * - MOTION.stagger   — Container + item variants for staggered lists
 * - MOTION.page      — Route transition enter/exit states
 *
 * Reduced-Motion:
 * - reducedFadeIn variant is the fallback for prefers-reduced-motion users
 * - It only animates opacity (no position/scale transforms)
 * - Use `useReducedMotion().resolve(full, reduced)` to pick automatically
 *
 * Naming Conventions:
 * - "hidden" = initial/exit state (element is invisible or off-screen)
 * - "visible" = animate-to state (element is visible at rest position)
 */

import type { Transition, Variants } from "framer-motion";

// Material Design / iOS standard easing curve — used for all transitions
// Matches the CSS value in transitions.ts for consistency across CSS & JS animations
const EASE_NATURAL: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ─── Expandable Content ───────────────────────────────────────────────────────

/**
 * Expand content variant — for the inner element inside an expanding container.
 * Slides down 8px while fading in as the outer height opens.
 * "hidden" = collapsed (top of expansion), "visible" = fully revealed.
 */
const expandContent: Variants = {
	hidden: { opacity: 0, y: -8 },
	visible: { opacity: 1, y: 0 },
};

/**
 * Expand transition with spring physics on height and fast opacity sync.
 * Height gets a springy feel (slight overshoot), opacity tracks quickly.
 * stiffness: 380 / damping: 38 / mass: 0.8 → subtle spring, not bouncy
 */
const expandTransitionSpring: Transition = {
	height: { type: "spring", stiffness: 380, damping: 38, mass: 0.8 },
	opacity: { duration: 0.2, ease: EASE_NATURAL },
};

// ─── Button Spring ────────────────────────────────────────────────────────────

/**
 * Button tap (depress) spring transition.
 * Used with whileTap={{ scale: 0.95 }} for a bouncy press-and-release feel.
 * stiffness: 600 / damping: 20 → snappy depress, quick rebound
 */
const tapSpring: Transition = {
	type: "spring",
	stiffness: 600,
	damping: 20,
};

// ─── Hover Color Map ─────────────────────────────────────────────────────────

/**
 * Hover target colors for each interactive element variant.
 * These are the CSS var expressions resolved at runtime — used as target values
 * in Framer Motion animate/whileHover props (inline style context only).
 *
 * ⚠ These are runtime values — do NOT use them inside CVA or Tailwind className strings.
 * Use them as: style={{ backgroundColor: MOTION.hover.primaryBg }}
 */
const hoverColors = {
	// Default button — bg becomes accent, text becomes accent-foreground
	// var(--accent) is used directly — the CSS var already contains the full oklch() function,
	// so wrapping it in another oklch() would produce invalid CSS: oklch(oklch(...))
	primaryBg: "var(--accent)",
	primaryText: "var(--accent-foreground)",

	// Destructive button — matches Tailwind bg-destructive/90 (90% opacity, not darker)
	destructiveBg: "color-mix(in srgb, var(--destructive) 90%, transparent)",

	// Ghost button — muted bg + accent text on hover
	ghostBg: "var(--muted)",
	ghostText: "var(--accent)",
	ghostBorder: "var(--accent)",

	// Link/text link hover color
	link: "var(--accent)",

	// Nav and footer links — same as link
	nav: "var(--accent)",

	// Border-only hover (outline/secondary buttons, accordion items)
	border: "var(--accent)",

	// Rest-state border colors — used to reset back after hover
	inputBorder: "var(--input)",
	primaryBorder: "var(--primary)",
};

// ─── Ripple Transitions ───────────────────────────────────────────────────────

/**
 * Transition configs for the clipPath ripple overlays.
 * - enter: circle expands from mouse entry point outward (background/text ripple)
 * - exit: overlay fades out after mouse leaves
 * - borderHover: smooth border color change via Framer Motion animate
 */
const rippleEnter: Transition = { duration: 0.5, ease: EASE_NATURAL };
const rippleExit: Transition = { duration: 0.3, ease: EASE_NATURAL };
const rippleBorderHover: Transition = { duration: 0.2, ease: EASE_NATURAL };

// ─── Variants ────────────────────────────────────────────────────────────────

/**
 * Fade: opacity only — used as the reduced-motion fallback for ALL animations.
 * Never plays transforms; safe for users who prefer reduced motion.
 */
const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

/**
 * Reduced-motion fallback: identical to fadeIn — alias for semantic clarity.
 * Use as the `reduced` argument to `useReducedMotion().resolve()`.
 */
const reducedFadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

/**
 * Slide directions: element fades in while translating from off-position.
 * Each starts 20px offset in the given direction.
 */
const slideUp: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const slideDown: Variants = {
	hidden: { opacity: 0, y: -20 },
	visible: { opacity: 1, y: 0 },
};

const slideLeft: Variants = {
	hidden: { opacity: 0, x: 20 }, // enters from right, slides left
	visible: { opacity: 1, x: 0 },
};

const slideRight: Variants = {
	hidden: { opacity: 0, x: -20 }, // enters from left, slides right
	visible: { opacity: 1, x: 0 },
};

/**
 * Scale: element fades in while scaling from 92% to 100%.
 * Subtle — feels like emerging from the background.
 */
const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.92 },
	visible: { opacity: 1, scale: 1 },
};

// ─── Stagger ─────────────────────────────────────────────────────────────────

/**
 * Stagger container variants — control the orchestration of child animations.
 * The container itself doesn't animate visually; it only manages timing.
 * Pair with `MOTION.stagger.item` on each child element.
 */
const staggerContainer: Variants = {
	hidden: {},
	visible: {
		transition: {
			// Normal stagger: 80ms between children, 50ms initial delay
			staggerChildren: 0.08,
			delayChildren: 0.05,
		},
	},
};

const staggerContainerFast: Variants = {
	hidden: {},
	visible: {
		transition: {
			// Fast stagger: 40ms between children (quick lists)
			staggerChildren: 0.04,
		},
	},
};

const staggerContainerSlow: Variants = {
	hidden: {},
	visible: {
		transition: {
			// Slow stagger: 150ms between children, 100ms initial delay (hero sections)
			staggerChildren: 0.15,
			delayChildren: 0.1,
		},
	},
};

/**
 * Stagger item variant — applied to each direct child of a stagger container.
 * Slides up 12px while fading in; inherits timing from parent's staggerChildren.
 */
const staggerItem: Variants = {
	hidden: { opacity: 0, y: 12 },
	visible: { opacity: 1, y: 0 },
};

// ─── Transitions ─────────────────────────────────────────────────────────────

/**
 * Pre-built transition timing configs for use with framer-motion.
 * Match the CSS transition values in transitions.ts for consistency.
 */
const transitionFast: Transition = { duration: 0.15, ease: EASE_NATURAL };
const transitionBase: Transition = { duration: 0.2, ease: EASE_NATURAL };
const transitionSlow: Transition = { duration: 0.3, ease: EASE_NATURAL };
const transitionSlower: Transition = { duration: 0.5, ease: EASE_NATURAL };
const transitionSpring: Transition = {
	type: "spring",
	stiffness: 300,
	damping: 30,
};

// ─── Page Transitions ─────────────────────────────────────────────────────────

/**
 * Page transition states for route changes.
 * Used with AnimatePresence in the root router layout.
 *
 * - initial: page enters from below (8px), faded out
 * - animate: page is fully visible at rest position
 * - exit: page leaves upward (-4px), faded out (less movement than enter)
 */
const pageInitial = { opacity: 0, y: 8 };
const pageAnimate = { opacity: 1, y: 0 };
const pageExit = { opacity: 0, y: -4 };

// Variants-style page transitions — use with initial="initial" animate="in" exit="out"
// Follows the TanStack Router + Framer Motion integration guide convention
const pageVariants = {
	initial: pageInitial,
	in: pageAnimate,
	out: pageExit,
};

// ─── Assembled MOTION Object ──────────────────────────────────────────────────

/**
 * MOTION — the complete framer-motion token system.
 * Import this wherever you need JS-driven animation values.
 *
 * @example
 * import { MOTION } from "../animations";
 *
 * <motion.div
 *   initial="hidden"
 *   animate="visible"
 *   variants={MOTION.variants.slideUp}
 *   transition={MOTION.transition.base}
 * />
 */
export const MOTION = {
	/**
	 * Reusable variant objects (hidden → visible state pairs).
	 * Pass to framer-motion's `variants` prop.
	 */
	variants: {
		fadeIn, // Opacity only
		reducedFadeIn, // Same as fadeIn — semantic alias for accessibility
		slideUp, // Fade + translate up (20px)
		slideDown, // Fade + translate down (-20px)
		slideLeft, // Fade + translate left (from right, 20px)
		slideRight, // Fade + translate right (from left, -20px)
		scaleIn, // Fade + scale from 92%
	},

	/**
	 * Expandable content animation tokens.
	 * content: variants for the inner fade+slide element inside an expanding container
	 * transitionSpring: spring height with fast opacity — used on the outer height-animating div
	 */
	expand: {
		content: expandContent, // Inner element: fade + slide down -8px → 0
		transitionSpring: expandTransitionSpring, // Outer height: spring + fast opacity
	},

	/**
	 * Button depress spring — use with whileTap={{ scale: 0.95 }}.
	 * Snappy depress with quick spring-back bounce.
	 */
	tap: tapSpring,

	/**
	 * Hover color values for each interactive variant.
	 * Runtime CSS var strings — use in inline style props or Framer Motion animate/whileHover.
	 * Do NOT use in className/CVA strings (Tailwind JIT can't process runtime values).
	 */
	hover: hoverColors,

	/**
	 * Ripple overlay transition configs.
	 * enter: clipPath circle expansion from mouse entry point
	 * exit: opacity fade on mouse leave
	 * borderHover: smooth border-color change via Framer Motion whileHover
	 */
	ripple: {
		enter: rippleEnter, // 500ms — circle expands out
		exit: rippleExit, // 300ms — overlay fades
		borderHover: rippleBorderHover, // 200ms — border color
	},

	/**
	 * Pre-built transition timing configs.
	 * Pass to framer-motion's `transition` prop.
	 */
	transition: {
		fast: transitionFast, // 150ms - buttons, micro-interactions
		base: transitionBase, // 200ms - most UI elements (default)
		slow: transitionSlow, // 300ms - modals, panels
		slower: transitionSlower, // 500ms - page-level animations
		spring: transitionSpring, // Spring physics - interactive drag targets
	},

	/**
	 * Stagger orchestration tokens for lists and grids.
	 * Use container on the parent, item on each child.
	 */
	stagger: {
		container: staggerContainer, // 80ms between children
		containerFast: staggerContainerFast, // 40ms between children
		containerSlow: staggerContainerSlow, // 150ms between children
		item: staggerItem, // Child variant: slide up 12px + fade
	},

	/**
	 * Page transition states for route changes.
	 * - flat props (initial/animate/exit): for direct motion prop usage
	 * - variants: for variant-based usage with initial="initial" animate="in" exit="out"
	 */
	page: {
		initial: pageInitial,
		animate: pageAnimate,
		exit: pageExit,
		variants: pageVariants,
	},
} as const;
