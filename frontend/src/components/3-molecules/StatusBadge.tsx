import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Badge } from "../2-atoms/Badge";
import type { BadgeStatus, StatusBadgeProps } from "./StatusBadge.types";

/**
 * StatusBadge Component
 *
 * Small inline badge for displaying status or difficulty levels.
 * Pre-configured color schemes for consistent status indication.
 *
 * Status Variants (Production):
 * - ready: Green (success) - Production ready, stable features
 * - soon: Blue - Coming soon, in development
 * - planned: Gray - Future roadmap items
 *
 * Difficulty Variants:
 * - beginner: Green (success) - Easy, entry-level
 * - intermediate: Blue - Medium difficulty
 * - advanced: Purple - High difficulty, expert level
 *
 * Visual Design:
 * - Inline-block display
 * - Rounded corners (rounded)
 * - Small text size (text-xs)
 * - Medium font weight (font-medium)
 * - Padding: 8px horizontal, 2px vertical (px-2 py-0.5)
 *
 * Color System:
 * - Light mode: Colored backgrounds (100 shade) with dark text (700 shade)
 * - Dark mode: Darker backgrounds (900/30 opacity) with lighter text (300 shade)
 * - Consistent opacity for visual harmony
 *
 * Label Override:
 * - Default: Uses pre-configured label from statusConfig
 * - Custom: Pass label prop to override default text
 *
 * Use Cases:
 * - Feature status indicators
 * - Difficulty ratings
 * - Progress states
 * - Availability markers
 */

/**
 * Status configuration mapping
 * Defines visual styling and default labels for each status type
 */
const statusConfig: Record<BadgeStatus, { style: string; label: string }> = {
	ready: {
		style: "bg-success/10 dark:bg-success/20 text-success dark:text-success",
		label: "Production Ready",
	},
	soon: {
		style: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
		label: "Coming Soon",
	},
	planned: {
		style:
			"bg-gray-100 dark:bg-foreground/30 text-muted-foreground dark:text-gray-300",
		label: "Planned",
	},
	beginner: {
		style: "bg-success/10 text-success",
		label: "Beginner",
	},
	intermediate: {
		style: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
		label: "Intermediate",
	},
	advanced: {
		style:
			"bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
		label: "Advanced",
	},
};

export const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
	const config = statusConfig[status];
	const displayLabel = label || config.label;

	return (
		<Badge
			className={cn(
				// Spacing
				"px-2 py-0.5",
				// Typography
				TYPOGRAPHY.COMBINATIONS.badge,
				// Variant Styling
				config.style,
				// Custom
				className,
			)}
		>
			{displayLabel}
		</Badge>
	);
};
