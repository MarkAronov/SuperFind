import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIZING } from "../1-ions/sizing";
import { Div } from "../2-atoms/Div";
import { List, ListItem } from "../2-atoms/List";
import { Text } from "../2-atoms/Text";
import type { FeatureListProps } from "./FeatureList.types";

/**
 * FeatureList Component
 *
 * Displays a list of features with customizable icons.
 * Commonly used for feature highlights, benefits lists, or capability summaries.
 *
 * Icon System:
 * - Default: Check icon (primary color, indicates included/completed)
 * - Custom: Pass any React element as icon prop
 * - Color: Customizable via iconColor prop (default: text-primary)
 * - Size: Medium (20px) with top alignment for multi-line items
 *
 * Variants:
 * - spaced: Comfortable spacing between items (default)
 * - compact: Tight spacing for dense lists
 *
 * Layout:
 * - Each item: Icon + text in horizontal flex
 * - Icon: Shrink-0 to prevent compression, mt-0.5 for alignment
 * - Text: Flexible width, wraps naturally
 *
 * Use Cases:
 * - Product feature lists
 * - Pricing plan inclusions
 * - Capability summaries
 * - Checklist presentations
 */

export const FeatureList = ({
	features,
	icon,
	iconColor = "text-primary",
	variant = "spaced",
	className = "",
}: FeatureListProps) => {
	// Use custom icon or default to Check icon
	const IconComponent = icon || (
		<Check
			className={cn(
				// Sizing
				SIZING.ICON.md,
				// Colors
				iconColor,
				// Layout
				"shrink-0 mt-0.5",
			)}
		/>
	);

	return (
		<List variant={variant} className={className}>
			{features.map((feature) => (
				<ListItem key={feature} variant="bullet">
					{/* Icon */}
					<Div>{IconComponent}</Div>
					{/* Feature text */}
					<Text>{feature}</Text>
				</ListItem>
			))}
		</List>
	);
};
