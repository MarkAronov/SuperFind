import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SIZING } from "../1-ions/sizing";
import { SPACING } from "../1-ions/spacing";
import { Div } from "../2-atoms/Div";
import { Text } from "../2-atoms/Text";
import type { LoadingStateProps } from "./LoadingState.types";

/**
 * LoadingState Component
 *
 * Displays animated loading spinner with optional message.
 * Centered layout for async data loading states.
 *
 * Size Variants:
 * - sm: 24px spinner (SIZING.SPINNER.md) with thin border
 * - md: 32px spinner (SIZING.SPINNER.lg) with thick border (default)
 * - lg: 48px spinner (SIZING.SPINNER.xl) with thick border
 *
 * Animation:
 * - Spinning border with transparent right side
 * - Primary color border (matches brand)
 * - Smooth rotation using animate-spin
 * - Rounded-full for perfect circle
 *
 * Layout:
 * - Centered div container (variant="center")
 * - Vertical flex with 32px gap between spinner and text
 * - Padding: 32px vertical (py-8)
 * - Message: Muted text variant
 *
 * Use Cases:
 * - Page loading states
 * - Data fetching indicators
 * - Async operation feedback
 * - Skeleton screen placeholders
 */

/**
 * Size mapping for spinner dimensions and border width
 * Combines spinner size token with border width token
 */
const sizeMap = {
	sm: `${SIZING.SPINNER.md} ${BORDERS.WIDTH.thin}`, // 24px, 1px border
	md: `${SIZING.SPINNER.lg} ${BORDERS.WIDTH.thick}`, // 32px, 4px border
	lg: `${SIZING.SPINNER.xl} ${BORDERS.WIDTH.thick}`, // 48px, 4px border
};

export const LoadingState = ({
	message = "Loading...",
	size = "md",
	className = "",
}: LoadingStateProps) => {
	return (
		<Div
			variant="center"
			className={cn(
				// Spacing
				"py-8",
				// Custom
				className,
			)}
		>
			{/* Spinner and message container */}
			<Div
				className={cn(
					// Layout
					"flex flex-col items-center",
					// Spacing
					SPACING.GAP.lg,
				)}
			>
				<Div
					className={cn(
						// Layout
						"inline-block",
						// Effects
						"rounded-full",
						// Border
						"border-solid border-primary border-r-transparent",
						// Animation
						"animate-spin",
						// Sizing
						sizeMap[size],
					)}
				/>
				<Text variant="muted">{message}</Text>
			</Div>
		</Div>
	);
};
