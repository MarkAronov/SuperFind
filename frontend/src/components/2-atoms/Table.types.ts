import type { ComponentProps } from "react";

/**
 * Table Component Props
 *
 * Enhanced table with professional features:
 * - Size variants (sm, md, lg) for different density levels
 * - Visual variants (simple, striped, outlined, minimal) for different aesthetics
 * - Layout modes (auto, fixed) for content wrapping vs fixed columns
 * - Interactive states (hover highlighting)
 * - Striped rows for better readability
 * - Sticky header for long tables
 * - Column borders for clearer separation
 */

export interface TableProps extends ComponentProps<"table"> {
	/**
	 * Size of the table - affects padding and font size
	 * - sm: Compact (8px padding, 12px font)
	 * - md: Standard (12px padding, 14px font) - default
	 * - lg: Spacious (16px padding, 16px font)
	 */
	size?: "sm" | "md" | "lg";

	/**
	 * Visual variant of the table
	 * - simple: Clean borderless design with spacing (default)
	 * - striped: Alternating row colors for better readability
	 * - outlined: Prominent border around entire table
	 * - minimal: Only header divider, very clean
	 */
	variant?: "simple" | "striped" | "outlined" | "minimal";

	/**
	 * Table layout algorithm
	 * - auto: Columns resize based on content, wraps naturally (default, no horizontal scroll)
	 * - fixed: Fixed column widths, enables horizontal scroll if needed
	 */
	layout?: "auto" | "fixed";

	/**
	 * Enable row hover highlighting for better interactivity
	 */
	interactive?: boolean;

	/**
	 * Make table header sticky when scrolling
	 */
	stickyHeader?: boolean;

	/**
	 * Show borders between columns
	 */
	showColumnBorder?: boolean;
}

export interface TableCellProps extends ComponentProps<"td"> {
	/**
	 * Cell content variant
	 * - default: Standard text
	 * - code: Monospace font for technical data
	 * - muted: De-emphasized text color
	 */
	variant?: "default" | "code" | "muted";
}

export interface TableRowProps extends ComponentProps<"tr"> {
	/**
	 * Make this row interactive (hover effect)
	 * Inherits from Table's interactive prop if not specified
	 */
	interactive?: boolean;
}
