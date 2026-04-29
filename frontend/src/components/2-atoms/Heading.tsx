import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "../1-ions/typography";
import type {
	HeadingLevel,
	HeadingProps,
	HeadingVariant,
} from "./Heading.types";

/**
 * Heading Component
 *
 * Semantic headings with visual styles independent of HTML level.
 * This allows proper document hierarchy while maintaining design flexibility.
 */

/**
 * Variant styles mapping
 * Each variant provides different visual weight:
 * - hero: Massive heading for page heroes (3xl → 5xl)
 * - section: Large heading for major sections (2xl → 3xl)
 * - subsection: Medium heading for subsections (xl → 2xl)
 * - card: Compact heading for cards and components (xl)
 */
const variantClasses: Record<HeadingVariant, string> = {
	// Hero heading - massive and bold for landing sections (30px → 48px)
	hero: `${TYPOGRAPHY.COMBINATIONS.heroHeading} mb-4`,

	// Section heading - large for major page sections (24px → 30px)
	section: `${TYPOGRAPHY.COMBINATIONS.sectionHeading} mb-4 lg:mb-6`,

	// Subsection heading - medium for nested sections (20px → 24px)
	subsection: `${TYPOGRAPHY.COMBINATIONS.subsectionHeading} mb-3 lg:mb-4`,

	// Card heading - compact for cards and components (20px)
	card: `${TYPOGRAPHY.COMBINATIONS.cardHeading} mb-2`,
};

const Heading = ({
	as: Component = "h1",
	className,
	variant,
	...props
}: HeadingProps) => {
	// Get the visual style if a variant is specified
	const variantClass = variant ? variantClasses[variant] : "";

	// Combine variant style with custom classes
	const combinedClassName = cn(variantClass, className);

	// Render with the appropriate semantic level (h1-h6)
	return <Component className={combinedClassName} {...props} />;
};

export { Heading, type HeadingLevel, type HeadingProps, type HeadingVariant };
