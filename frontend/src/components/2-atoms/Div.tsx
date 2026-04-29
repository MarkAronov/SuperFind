import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SPACING } from "../1-ions/spacing";
import type { DivProps, DivVariant } from "./Div.types";

/**
 * Div Component
 *
 * A semantic container with common layout patterns.
 * For one-off custom layouts, use regular <div> with Tailwind directly.
 */

/**
 * Variant styles mapping
 * Each variant provides a common layout pattern:
 * - default: Plain container with no special styling
 * - flex: Horizontal flexbox with medium gap (common pattern)
 * - center: Centers content both horizontally and vertically
 * - stack: Vertical spacing for content stacking
 * - codeBlock: Styled container for code display
 */
const variantClasses: Record<DivVariant, string> = {
	// Plain container - no special styling
	default: "",

	// Horizontal flexbox - common for side-by-side elements
	flex: `flex ${SPACING.GAP.md} items-start`,

	// Center layout - perfect for modals, spinners, empty states
	center: "flex justify-center items-center",

	// Vertical stack - common for content sections
	stack: SPACING.STACK.md,

	// Code block - muted background with rounded corners
	codeBlock: `bg-muted/50 ${BORDERS.RADIUS.lg} p-4`,
};

const Div = ({
	className,
	variant = "default",
	constrain = false,
	maxWidthClass,
	...props
}: DivProps) => {
	// Get the layout style for the selected variant
	const variantClass = variantClasses[variant];

	// Apply width constraint if requested (for readable line lengths)
	const constraintClass = constrain
		? (maxWidthClass ?? "max-w-2xl mx-auto")
		: "";

	// Combine all classes
	const combinedClassName = cn(variantClass, constraintClass, className);

	return <div className={combinedClassName} {...props} />;
};

export { Div, type DivProps, type DivVariant };
