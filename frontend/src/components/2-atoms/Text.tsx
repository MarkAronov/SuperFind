import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "../1-ions/typography";
import type { TextProps, TextVariant } from "./Text.types";

/**
 * Text Component
 *
 * A flexible text component that supports multiple semantic variants.
 * Each variant has its own size, color, and spacing optimized for its purpose.
 */

/**
 * Variant styles mapping
 * Each variant is designed for a specific use case:
 * - body: Standard paragraph text (most common)
 * - lead: Larger introductory or emphasized text
 * - muted: De-emphasized secondary text
 * - small: Compact text for metadata or captions
 * - caption: Tiny text for image captions or footnotes
 * - heading: Alternative heading style when you need <p> semantics
 * - subheading: Alternative subheading style when you need <p> semantics
 */
const variantClasses: Record<TextVariant, string> = {
	// Standard body text - the default for most content (14px → 16px)
	body: `${TYPOGRAPHY.COMBINATIONS.bodySmall} text-foreground leading-relaxed`,

	// Lead paragraph - larger, attention-grabbing introductory text (16px → 20px)
	lead: `${TYPOGRAPHY.COMBINATIONS.bodyLarge} text-muted-foreground leading-relaxed`,

	// Muted text - de-emphasized secondary information (14px → 16px)
	muted: `${TYPOGRAPHY.COMBINATIONS.bodyMuted} leading-relaxed`,

	// Small text - compact for metadata, labels, or fine print (12px → 14px)
	small: `${TYPOGRAPHY.COMBINATIONS.smallMuted} leading-relaxed`,

	// Caption text - tiny text for image captions or footnotes (12px)
	caption: TYPOGRAPHY.COMBINATIONS.caption,

	// Heading style - when you need heading appearance with <p> semantics (24px → 30px)
	heading: TYPOGRAPHY.COMBINATIONS.sectionHeading,

	// Subheading style - when you need subheading appearance with <p> semantics (16px → 18px)
	subheading: TYPOGRAPHY.COMBINATIONS.subheading,
};

const Text = ({
	className,
	variant = "body",
	as: Component = "p",
	...props
}: TextProps) => {
	// Get the appropriate classes for the selected variant
	const variantClass = variantClasses[variant];

	// Combine variant classes with any custom classes
	const combinedClassName = cn(variantClass, className);

	return <Component className={combinedClassName} {...props} />;
};

export { Text, type TextProps, type TextVariant };
