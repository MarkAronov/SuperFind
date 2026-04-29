import { cn } from "@/lib/utils";
import { SPACING } from "../1-ions/spacing";
import type { SectionGap, SectionProps, SectionVariant } from "./Section.types";

/**
 * Section Component
 *
 * Semantic wrapper for page sections with consistent vertical spacing.
 * Creates visual rhythm and hierarchy throughout your layout.
 *
 * Two spacing modes:
 * 1. `variant` — named presets for general-purpose sections
 * 2. `gap` — syncs padding to a Grid's gap using a 2:1 ratio
 *    (Section padding is always ~2× the Grid inter-card gap)
 */

/**
 * Variant styles mapping
 * Each variant provides different spacing and alignment:
 * - default: Small spacing for standard sections
 * - hero: Large centered spacing for hero/landing sections
 * - spaced: Medium spacing for well-separated content
 * - compact: Extra small spacing for dense layouts
 */
const variantClasses: Record<SectionVariant, string> = {
	// Default spacing - small, for standard sections
	default: SPACING.SECTION.sm,

	// Hero spacing - large and centered for landing sections
	hero: `text-center ${SPACING.SECTION.lg}`,

	// Spaced - medium spacing for comfortable reading
	spaced: SPACING.SECTION.md,

	// Compact - extra small for dense content
	compact: SPACING.SECTION.xs,
};

/**
 * Gap-synced padding classes (2:1 ratio with Grid gap)
 *
 * Grid gap:  sm=16px  md=24px  lg=32px  xl=48px
 * Section py:    sm=32px  md=48px  lg=64px  xl=96px
 *
 * This ensures visual hierarchy: cards within a group are tighter,
 * while sections are visually separated at double the spacing.
 */
const gapSyncClasses: Record<SectionGap, string> = {
	// 2× Grid gap-4 (16px) → py-8 (32px)
	sm: "py-8",

	// 2× Grid gap-6 (24px) → py-12 (48px)
	md: "py-12",

	// 2× Grid gap-8 (32px) → py-16 (64px)
	lg: "py-16",

	// 2× Grid gap-12 (48px) → py-24 (96px)
	xl: "py-24",
};

const Section = ({
	className,
	variant = "default",
	gap,
	...props
}: SectionProps) => {
	// If gap is provided, use the 2:1 synced spacing; otherwise fall back to variant
	const spacingClass = gap ? gapSyncClasses[gap] : variantClasses[variant];

	// Combine spacing with custom classes
	const combinedClassName = cn(spacingClass, className);

	return <section className={combinedClassName} {...props} />;
};

export { Section, type SectionGap, type SectionProps, type SectionVariant };
