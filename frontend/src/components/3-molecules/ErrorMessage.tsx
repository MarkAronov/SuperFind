import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { Div } from "../2-atoms/Div";
import { Text } from "../2-atoms/Text";
import { Card, CardContent } from "./Card";
import type { ErrorMessageProps } from "./ErrorMessage.types";

/**
 * ErrorMessage Component
 *
 * Displays contextual messages with appropriate severity styling.
 * Combines icon, title, message, and optional children in a card layout.
 *
 * Variants:
 * - error: Red color scheme (errors, failures, critical issues)
 * - warning: Amber color scheme (cautions, warnings, deprecations)
 * - info: Blue color scheme (information, tips, notices)
 *
 * Visual Elements:
 * - Icon: Variant-specific Lucide icon (20px, aligned top)
 * - Title: Semibold text (defaults to variant name if not provided)
 * - Message: Primary message text
 * - Children: Optional additional content below message
 *
 * Color System:
 * - Light mode: Colored backgrounds (red-50, amber-50, blue-50)
 * - Dark mode: Subtle colored backgrounds with opacity (950/20)
 * - Borders: Matching colored borders for emphasis
 *
 * Layout:
 * - Horizontal flex with icon and content
 * - Gap spacing between icon and text
 * - Icon aligned to top (mt-0.5) for multi-line messages
 */

/**
 * Variant style mapping
 * Defines background, text, and border colors for each severity level
 */
const variantStyles = {
	// Error: Red color scheme (critical issues, failures)
	error:
		"bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",

	// Warning: Amber color scheme (cautions, deprecations)
	warning:
		"bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",

	// Info: Blue color scheme (informational messages)
	info: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
};

/**
 * Variant icon mapping
 * Assigns appropriate Lucide icon to each severity level
 */
const variantIcons = {
	error: (
		<AlertCircle
			className={cn(
				// Sizing
				SIZING.ICON.md,
				// Layout
				"shrink-0 mt-0.5",
			)}
		/>
	), // Circle with X (errors)
	warning: (
		<AlertTriangle
			className={cn(
				// Sizing
				SIZING.ICON.md,
				// Layout
				"shrink-0 mt-0.5",
			)}
		/>
	), // Triangle with ! (warnings)
	info: (
		<Info
			className={cn(
				// Sizing
				SIZING.ICON.md,
				// Layout
				"shrink-0 mt-0.5",
			)}
		/>
	), // Circle with i (info)
};

export const ErrorMessage = ({
	message,
	title,
	variant = "error",
	className = "",
	children,
}: ErrorMessageProps) => {
	// Default title based on variant severity
	const defaultTitle =
		variant === "error" ? "Error" : variant === "warning" ? "Warning" : "Info";

	// Select variant styling
	const variantClass = variantStyles[variant];

	// Select variant icon
	const variantIcon = variantIcons[variant];

	// Combine variant and custom classes
	const combinedClassName = cn(variantClass, BORDERS.RADIUS.lg, className);

	return (
		<Div className={combinedClassName}>
			<Card variant="hover">
				<CardContent>
					{/* Icon and message container */}
					<Div
						className={cn(
							// Layout
							"flex",
							// Spacing
							SPACING.GAP.sm,
						)}
					>
						{/* Icon */}
						{variantIcon}
						{/* Content */}
						<Div className="flex-1">
							<Text className="font-semibold">{title || defaultTitle}:</Text>
							<Text className="mt-1">{message}</Text>
							{children}
						</Div>
					</Div>
				</CardContent>
			</Card>
		</Div>
	);
};
