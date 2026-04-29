import { cn } from "@/lib/utils";
import { SPACING } from "../1-ions/spacing";
import type { ListItemProps, ListProps, ListVariant } from "./List.types";

/**
 * List Components
 *
 * Semantic list components for different layout patterns.
 * Use List for the container, ListItem for individual items.
 */

/**
 * List variant styles
 * Each variant provides a different list layout:
 * - default: Plain unstyled list
 * - disc: Traditional bullet list with indentation
 * - inline: Horizontal inline list with gaps
 * - spaced: Vertical list with medium spacing
 */
const variantClasses: Record<ListVariant, string> = {
	// Plain list - no special styling
	default: "",

	// Disc bullets - traditional bullet list with left margin
	disc: `list-disc list-inside ${SPACING.STACK.sm} ml-4`,

	// Inline layout - horizontal with small gaps
	inline: `flex flex-wrap ${SPACING.GAP.sm}`,

	// Spaced layout - vertical with medium gaps
	spaced: SPACING.STACK.md,
};

const List = ({ className, variant = "default", ...props }: ListProps) => {
	// Get the layout for the selected variant
	const layoutClass = variantClasses[variant];

	// Combine layout with custom classes
	const combinedClassName = cn(layoutClass, className);

	return <ul className={combinedClassName} {...props} />;
};

/**
 * ListItem variant styles
 * Coordinate with parent List variant:
 * - default: Plain item
 * - bullet: Flex layout for custom bullets/icons
 * - inline: No special styling (spacing handled by parent)
 */
const itemVariants = {
	// Plain item - no special styling
	default: "",

	// Bullet item - flex layout for custom bullets
	bullet: `flex ${SPACING.GAP.sm}`,

	// Inline item - inherits parent layout
	inline: "",
};

const ListItem = ({
	className,
	variant = "default",
	...props
}: ListItemProps) => {
	// Get the item style for the selected variant
	const itemClass = itemVariants[variant];

	// Combine item style with custom classes
	const combinedClassName = cn(itemClass, className);

	return <li className={combinedClassName} {...props} />;
};

export { List, ListItem, type ListItemProps, type ListProps, type ListVariant };
