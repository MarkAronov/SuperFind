import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { BORDERS } from "../1-ions/borders";
import { Glassmorphism as Glass } from "../1-ions/designs/Glassmorphism";
import { SHADOWS } from "../1-ions/shadows";
import { TYPOGRAPHY } from "../1-ions/typography";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Text } from "../2-atoms/Text";
import type { CardHeaderProps, CardProps, CardVariant } from "./Card.types";

/**
 * Card Component
 *
 * Flexible card container with glassmorphism effects and consistent spacing.
 * Composable subcomponents for structured content (header, title, description, content, footer).
 *
 * Architecture:
 * - Glass primitive: Provides ONLY glassmorphism (backdrop-filter, blur, noise texture)
 * - Card component: Provides ALL structural styling (borders, shadows, padding, layout)
 *
 * Spacing System:
 * - Unified padding constants ensure consistency across all card subcomponents
 * - Base: 32px (p-8), Desktop (lg+): 48px (p-12)
 * - All subcomponents reference CARD_SPACING tokens for alignment
 *
 * Variants:
 * - default: Standard card appearance (no additional styling)
 * - hover: Interactive card (future: hover effects, transitions)
 * - feature: Featured/emphasized card (future: enhanced styling)
 *
 * Subcomponents:
 * - CardHeader: Top section (icon + title area or title only)
 * - CardTitle: Semibold heading text
 * - CardDescription: Muted secondary text (12-14px)
 * - CardAction: Action link/button area (auto top margin)
 * - CardContent: Main content area (full height flex container)
 * - CardFooter: Bottom action area (aligned items)
 *
 * Fill Mode:
 * - fill={true}: Card expands to 100% height (h-full)
 * - Useful in grid layouts where all cards should match tallest sibling
 */

/**
 * Card spacing constants
 * Single source of truth for consistent padding across all card parts
 */
const CARD_PADDING = "2rem"; // 32px base (p-8), 48px desktop (lg:p-12)

const CARD_SPACING = {
	padding: CARD_PADDING, // Full padding (all sides)
	paddingX: "px-8 lg:px-12", // Horizontal only (32px → 48px)
	paddingY: "py-8 lg:py-12", // Vertical only (32px → 48px)
	paddingTop: "pt-8 lg:pt-12", // Top only (32px → 48px)
	paddingBottom: "pb-8 lg:pb-12", // Bottom only (32px → 48px)
};

/**
 * Variant style mapping
 * Defines additional styling for card variants
 */
const variantClasses: Record<CardVariant, string> = {
	default: "", // No additional styles (base card)
	hover: "", // Reserved for future hover effects
	feature: "", // Reserved for future featured styling
};

/**
 * Card Root Component
 * Main container with glassmorphism effects and depth styling
 */
const Card = ({
	className,
	variant = "default",
	children,
	fill = false,
	minHeightClass,
	...props
}: CardProps) => {
	// Build class components
	const fillClass = fill ? "h-full" : "";
	const minHClass = minHeightClass ?? "";
	const variantClass = variantClasses[variant];

	// Combine all card styling
	// Glass primitive handles backdrop-filter & background-color — don't override here
	const combinedClassName = cn(
		"text-card-foreground flex flex-col",
		"backdrop-blur-sm bg-white/40 dark:bg-black/30", // Glassmorphism background
		BORDERS.RADIUS["2xl"], // 16px border radius
		`${SHADOWS.lg} shadow-black/5 dark:shadow-black/20`, // Elevated shadow
		"border border-white/20 dark:border-white/10", // Subtle border
		"relative z-10", // Stacking context (no overflow-hidden — preserves backdrop-filter)
		variantClass,
		fillClass,
		minHClass,
		className,
	);

	return (
		<Glass
			variant="card"
			data-slot="card"
			className={combinedClassName}
			{...props}
		>
			{children}
		</Glass>
	);
};

/**
 * CardHeader Component
 * Top section of card, supports icon placement and centered layout
 */
const CardHeader = ({
	className,
	icon,
	iconColor = "text-primary",
	children,
	...props
}: CardHeaderProps) => {
	// Icon header: Centered layout with icon above content
	if (icon) {
		return (
			<Div
				data-slot="card-header"
				className={cn(CARD_SPACING.paddingY, CARD_SPACING.paddingX, className)}
				{...props}
			>
				<Div className="flex flex-col items-center text-center gap-4">
					<Div className={cn("shrink-0", iconColor)}>{icon}</Div>
					<Div className="w-full">{children}</Div>
				</Div>
			</Div>
		);
	}

	// Standard header: Top padding with horizontal spacing
	return (
		<Div
			data-slot="card-header"
			className={cn(CARD_SPACING.paddingX, CARD_SPACING.paddingTop, className)}
			{...props}
		>
			{children}
		</Div>
	);
};

/**
 * CardTitle Component
 * Semibold heading text for card title
 * Uses Heading atom for semantic HTML structure
 */
const CardTitle = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<Heading
			as="h3"
			data-slot="card-title"
			className={cn(TYPOGRAPHY.COMBINATIONS.cardHeading, className)}
			{...props}
		/>
	);
};

/**
 * CardDescription Component
 * Muted secondary text for card descriptions (12-14px responsive)
 * Uses Text atom for semantic HTML structure
 */
const CardDescription = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<Text
			data-slot="card-description"
			className={cn(TYPOGRAPHY.COMBINATIONS.smallMuted, className)}
			{...props}
		/>
	);
};

/**
 * CardAction Component
 * Action link or button area with automatic top spacing
 */
const CardAction = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<Div data-slot="card-action" className={cn("mt-2", className)} {...props} />
	);
};

/**
 * CardContent Component
 * Main content area with full padding and flexible height
 * Optionally centered for symmetric layouts
 */
const CardContent = ({
	className,
	centered = false,
	...props
}: ComponentProps<"div"> & { centered?: boolean }) => {
	// Build content classes
	const centeredClass = centered ? "text-center" : "";

	// Combine content styling
	const combinedClassName = cn(
		"p-8 lg:p-12 flex flex-col h-full", // Full padding, flex container, fill height
		centeredClass,
		className,
	);

	return (
		<Div data-slot="card-content" className={combinedClassName} {...props} />
	);
};

/**
 * CardFooter Component
 * Bottom section with horizontal alignment for actions
 */
const CardFooter = ({ className, ...props }: ComponentProps<"div">) => {
	// Combine footer styling
	const combinedClassName = cn(
		CARD_SPACING.paddingX, // Horizontal padding
		CARD_SPACING.paddingBottom, // Bottom padding
		"flex items-center", // Horizontal flex with vertical alignment
		className,
	);

	return (
		<Div data-slot="card-footer" className={combinedClassName} {...props} />
	);
};

export {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	type CardHeaderProps,
	type CardProps,
	type CardVariant,
};
