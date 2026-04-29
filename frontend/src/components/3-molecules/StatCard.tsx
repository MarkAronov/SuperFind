import type React from "react";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Text } from "../2-atoms/Text";
import type { StatCardProps, StatCardVariant } from "./StatCard.types";

/**
 * StatCard Component
 *
 * Displays a single statistic with icon, label, and value.
 * Vertical centered layout within a rounded, colored background box.
 *
 * Visual Structure:
 * - Container: Rounded box with variant background (12px padding, rounded-xl)
 * - Icon: 24px (size-6) with variant color at top
 * - Label: Small muted text (descriptive) centered below icon
 * - Value: Card heading variant with variant color at bottom
 *
 * Variants (semantic colors from ions):
 * - primary: Indigo — brand actions, versions, key metrics
 * - secondary: Violet — supporting data, categories
 * - accent: Pink — highlights, contributors, engagement
 * - destructive: Red — errors, issues, warnings
 * - success: Green — positive metrics, stable releases
 * - warning: Amber — caution, pre-releases, pending items
 * - muted: Gray — neutral info, metadata
 *
 * Layout:
 * - Vertical flex column with centered items
 * - 8px gap between elements (gap-2)
 * - All text centered for visual balance
 * - No truncation needed - full width available for text
 *
 * Grid Usage:
 * - Designed to work in grid layouts with consistent sizing
 * - Equal height/width cards when used in CSS Grid
 * - Responsive grid: 1 col mobile → 2 cols sm → 3 cols lg → 6 cols xl
 *
 * Use Cases:
 * - Dashboard statistics grids
 * - Metric displays
 * - Summary card grids
 * - KPI indicator panels
 */

/**
 * Variant color map — uses only semantic design system colors
 * Each variant maps to: icon box background, icon color, and value color
 */
const VARIANT_STYLES: Record<
	StatCardVariant,
	{ bg: string; icon: string; value: string }
> = {
	// Indigo — brand actions, versions
	primary: {
		bg: "bg-primary/10",
		icon: "text-primary",
		value: "text-primary",
	},
	// Violet — supporting data
	secondary: {
		bg: "bg-secondary/10",
		icon: "text-secondary",
		value: "text-secondary",
	},
	// Pink — highlights, engagement
	accent: {
		bg: "bg-accent/10",
		icon: "text-accent",
		value: "text-accent",
	},
	// Red — errors, issues
	destructive: {
		bg: "bg-destructive/10",
		icon: "text-destructive",
		value: "text-destructive",
	},
	// Green — positive metrics
	success: {
		bg: "bg-success/10",
		icon: "text-success",
		value: "text-success",
	},
	// Amber — caution, pre-releases
	warning: {
		bg: "bg-warning/10",
		icon: "text-warning",
		value: "text-warning",
	},
	// Gray — neutral info
	muted: {
		bg: "bg-muted",
		icon: "text-muted-foreground",
		value: "text-muted-foreground",
	},
};

export const StatCard: React.FC<StatCardProps> = ({
	icon: Icon,
	variant = "primary",
	label,
	value,
}) => {
	// Resolve variant styles from the semantic color map
	const styles = VARIANT_STYLES[variant];

	return (
		<Div
			className={cn(
				// Layout - vertical centered, full height to fill grid cell
				"flex flex-col items-center justify-center text-center h-full",
				// Spacing
				"p-3",
				SPACING.GAP.xs,
				// Effects
				BORDERS.RADIUS.xl,
				// Colors — variant-driven
				styles.bg,
			)}
		>
			{/* Stat icon */}
			<Icon
				className={cn(
					// Sizing — uses ion token
					SIZING.ICON.lg,
					// Colors — variant-driven
					styles.icon,
				)}
			/>

			{/* Label text */}
			<Text
				variant="small"
				className={cn(
					// Colors
					"text-muted-foreground",
				)}
			>
				{label}
			</Text>

			{/* Value heading */}
			<Heading
				as="h3"
				variant="card"
				className={cn(
					// Colors — variant-driven
					styles.value,
				)}
			>
				{value}
			</Heading>
		</Div>
	);
};
