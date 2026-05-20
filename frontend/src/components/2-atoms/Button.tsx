import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
	AnimatePresence,
	motion,
	type TargetAndTransition,
} from "framer-motion";
import type * as React from "react";
import { MOTION } from "@/animations/0-tokens/tokens";
import { cn } from "@/lib/utils";
import { useHoverRipple } from "../../hooks/animations/useHoverRipple";

/**
 * Button Component
 *
 * Interactive button element for actions and navigation.
 * Custom implementation with SkillVector's styling enhancements.
 *
 * Variants available:
 * - default: Primary action button - pink accent on hover
 * - destructive: Dangerous actions (delete, remove)
 * - outline: Secondary actions with border - pink accent on hover
 * - secondary: Muted secondary actions - pink border + background on hover
 * - ghost: Minimal button without background
 * - link: Text-only button styled like a link - no underline, pink on hover
 *
 * Sizes available:
 * - xs: Extra small button (compact, 24px height)
 * - sm: Small button (compact, 32px height)
 * - default: Standard button size (36px height)
 * - lg: Large button (prominent, 40px height)
 * - icon: Square button for icons only (36px)
 * - icon-xs: Extra small square icon button (24px)
 * - icon-sm: Small square icon button (32px)
 * - icon-lg: Large square icon button (40px)
 */

const buttonVariants = cva(
	// Base: relative + overflow-hidden makes the ripple overlay clip inside the button shape
	// transition-all removed — Framer Motion handles all color/scale transitions
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium relative overflow-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive no-underline",
	{
		variants: {
			variant: {
				// Default — solid primary bg; hover handled by Framer Motion ripple overlay
				default: "bg-primary text-primary-foreground",

				// Destructive — hover handled by Framer Motion ripple overlay
				destructive:
					"bg-destructive text-white focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",

				// Outline — neutral border; Framer Motion animates bg + borderColor on hover
				// dark:bg-input/30 provides a subtle rest-state tint in dark mode
				outline:
					"border border-input bg-transparent dark:bg-input/30 dark:border-input",

				// Secondary — primary border; Framer Motion animates bg + borderColor on hover
				secondary:
					"border border-primary bg-transparent text-primary dark:border-primary",

				// Ghost — Framer Motion handles bg + text + border on hover
				ghost: "border border-transparent bg-transparent",

				// Link — text only; Framer Motion animates text color via MotionTextRipple
				link: "text-primary",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

/**
 * Per-variant ripple overlay config.
 * bg: the background color the ripple circle fills with
 * text: if set, the content span animates to this color in sync with the ripple
 *
 * Original Tailwind hover classes per variant:
 *   default:     hover:bg-accent hover:text-accent-foreground  → bg ripple + text color
 *   destructive: hover:bg-destructive/90                       → bg ripple only (text stays white)
 *   outline:     hover:bg-muted hover:border-accent            → bg ripple + border (text stays)
 *   secondary:   hover:bg-muted hover:border-accent            → bg ripple + border (text stays)
 *   ghost:       hover:bg-muted hover:text-accent hover:border-accent → bg ripple + text + border
 *   link:        handled by MotionTextRipple inside Link atom
 */
const variantRippleConfig = {
	// Default — ripple fills with accent bg; text changes to accent-foreground in sync
	default: {
		type: "bg" as const,
		bg: MOTION.hover.primaryBg,
		text: MOTION.hover.primaryText,
	},
	// Destructive — ripple fills with 90% opacity destructive; text stays white (no text prop)
	destructive: {
		type: "bg" as const,
		bg: MOTION.hover.destructiveBg,
		text: undefined,
	},
	// Outline — ripple fills with muted bg; text stays as-is (no text prop)
	outline: { type: "bg" as const, bg: MOTION.hover.ghostBg, text: undefined },
	// Secondary — ripple fills with muted bg; text stays as-is (no text prop)
	secondary: { type: "bg" as const, bg: MOTION.hover.ghostBg, text: undefined },
	// Ghost — ripple fills with muted bg; text changes to accent in sync
	ghost: {
		type: "bg" as const,
		bg: MOTION.hover.ghostBg,
		text: MOTION.hover.ghostText,
	},
	// Link — no bg ripple; MotionTextRipple in Link handles text color
	link: { type: "none" as const, text: undefined },
} as const;

/**
 * Per-variant whileHover for border color changes only.
 * Text color is handled separately via the content span's animate prop (synced to ripple).
 * Background is handled by the clipPath ripple overlay.
 *
 * Only outline/secondary/ghost need border animation:
 *   outline/secondary: hover:border-accent
 *   ghost:             hover:border-accent
 */
const variantHoverAnimate: Record<string, TargetAndTransition | undefined> = {
	default: undefined,
	destructive: undefined,
	outline: {
		borderColor: MOTION.hover.border,
		transition: MOTION.ripple.borderHover,
	},
	secondary: {
		borderColor: MOTION.hover.border,
		transition: MOTION.ripple.borderHover,
	},
	ghost: {
		borderColor: MOTION.hover.border,
		transition: MOTION.ripple.borderHover,
	},
	link: undefined,
};

/**
 * React event handlers that conflict with Framer Motion's own event types.
 * We omit these from the Button prop type so spreading ...props onto motion.button
 * doesn't cause TypeScript conflicts between React and Framer Motion signatures.
 * If consumers need these handlers, they should wrap Button in their own element.
 */
type ConflictingReactEvents =
	| "onDrag"
	| "onDragStart"
	| "onDragEnd"
	| "onDragEnter"
	| "onDragLeave"
	| "onDragOver"
	| "onAnimationStart";

/**
 * CSS hover fallback for asChild buttons — since Slot renders the child element
 * directly, we can't use motion.button or inject a ripple overlay. These are the
 * original Tailwind hover classes restored with transition-colors for a smooth
 * CSS color transition.
 *
 * Non-asChild buttons do NOT use these — they get the Framer Motion ripple instead.
 */
const asChildHoverClasses: Record<string, string> = {
	// Matches original: hover:bg-accent hover:text-accent-foreground
	default: "transition-colors hover:bg-accent hover:text-accent-foreground",
	// Matches original: hover:bg-destructive/90
	destructive: "transition-colors hover:bg-destructive/90",
	// Matches original: hover:bg-muted hover:border-accent (+ dark overrides)
	outline:
		"transition-colors hover:bg-muted hover:border-accent dark:hover:border-accent dark:hover:bg-muted",
	// Matches original: hover:bg-muted hover:border-accent (+ dark overrides)
	secondary:
		"transition-colors hover:bg-muted hover:border-accent dark:hover:border-accent dark:hover:bg-muted",
	// Matches original: hover:bg-muted hover:text-accent hover:border-accent
	ghost:
		"transition-colors hover:bg-muted hover:text-accent hover:border-accent",
	// Matches original: hover:text-accent
	link: "transition-colors hover:text-accent",
};

type ButtonProps = Omit<
	React.ComponentProps<"button">,
	ConflictingReactEvents
> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	};

const Button = ({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	children,
	...props
}: ButtonProps) => {
	// Hooks must always be called before any early return (Rules of Hooks)
	// Ripple tracking — mouse entry coordinates as element-relative percentages
	const { rippleX, rippleY, isHovering, onMouseEnter, onMouseLeave } =
		useHoverRipple();

	// asChild: render through Slot (child element becomes the button).
	// Slot can't use motion.button, so we restore CSS hover classes as fallback.
	if (asChild) {
		// Look up the CSS hover class set for this variant
		const hoverFallback = asChildHoverClasses[variant ?? "default"];

		return (
			<Slot
				data-slot="button"
				data-variant={variant}
				data-size={size}
				className={cn(
					buttonVariants({ variant, size, className }),
					hoverFallback,
				)}
				{...props}
			>
				{children}
			</Slot>
		);
	}

	// Look up the ripple and hover-animate configs for this variant
	const rippleConfig = variantRippleConfig[variant ?? "default"];
	const hoverAnimate = variantHoverAnimate[variant ?? "default"];

	return (
		<motion.button
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			// Spring depress on click — transition lives inside whileTap so it only
			// applies to the scale property, not to border/color hover transitions
			whileTap={{ scale: 0.95, transition: MOTION.tap }}
			// Per-variant border/text color changes (outline, secondary, ghost)
			// whileHover auto-reverses back to CSS resting values on mouse leave
			whileHover={hoverAnimate}
			// Mouse events feed the ripple overlay position tracker
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			{...props}
		>
			{/* Background ripple overlay — only for solid bg variants (default, destructive, ghost) */}
			{rippleConfig.type === "bg" && (
				<AnimatePresence>
					{isHovering && (
						<motion.span
							// aria-hidden: purely visual, not interactive
							aria-hidden="true"
							className="absolute inset-0 pointer-events-none rounded-[inherit]"
							style={{ backgroundColor: rippleConfig.bg }}
							// Circle grows from mouse entry point outward
							initial={{ clipPath: `circle(0% at ${rippleX}% ${rippleY}%)` }}
							animate={{ clipPath: `circle(150% at ${rippleX}% ${rippleY}%)` }}
							exit={{ opacity: 0 }}
							transition={{
								clipPath: MOTION.ripple.enter,
								opacity: MOTION.ripple.exit,
							}}
						/>
					)}
				</AnimatePresence>
			)}

			{/* Button content — sits above the ripple overlay via z-index stacking.
			    When variant has a text hover color, animate it in sync with the ripple. */}
			<motion.span
				className="relative z-10 inline-flex items-center justify-center gap-2"
				// Animate text color when hovering (only for variants with a text target)
				animate={
					rippleConfig.text
						? { color: isHovering ? rippleConfig.text : "inherit" }
						: undefined
				}
				transition={MOTION.ripple.borderHover}
			>
				{children}
			</motion.span>
		</motion.button>
	);
};

export { Button, buttonVariants };
