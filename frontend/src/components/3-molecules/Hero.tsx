import { FadeIn } from "@/animations/1-entrance/FadeIn";
import { SlideIn } from "@/animations/1-entrance/SlideIn";
import { cn } from "@/lib/utils";
import { Div } from "../2-atoms/Div";
import { Heading } from "../2-atoms/Heading";
import { Span } from "../2-atoms/Span";
import { Text } from "../2-atoms/Text";
import type { HeroProps } from "./Hero.types";

/**
 * Hero Component
 *
 * Large hero section for page headers with prominent title and subtitle.
 * Supports optional brand text with gradient styling.
 *
 * Visual Elements:
 * - Title: Hero variant heading (largest text size)
 * - Brand: Optional highlighted text with gradient (clips to text)
 * - Subtitle: Lead text variant (descriptive)
 *
 * Layout:
 * - Default: Centered text alignment (text-center)
 * - Spacing: Large top padding (64-96px) to clear the header; small bottom
 *   padding (24-32px) since Hero is always immediately followed by a
 *   Section/content block that supplies its own top padding — matching
 *   bottom paddings here stacked with theirs into a ~150px dead gap
 * - Width: Controlled by parent container (PageTemplate)
 *
 * Gradient System:
 * - gradientClass: Custom gradient for brand text
 * - Default: "bg-linear-to-r from-primary to-secondary"
 * - Uses bg-clip-text for gradient text effect
 *
 * Use Cases:
 * - Landing page headers
 * - Feature section intros
 * - Page title banners
 * - Product launch announcements
 */

const Hero = ({
	className,
	title,
	subtitle,
	brand,
	gradientClass = "bg-linear-to-r from-primary to-secondary",
	centered = true,
	...props
}: HeroProps) => {
	// Build centered class
	const centeredClass = centered ? "text-center" : "";

	// Build gradient brand class
	const brandClass = cn(gradientClass, "bg-clip-text text-transparent");

	// Combine section classes — asymmetric padding, see Layout note above
	const combinedClassName = cn(
		centeredClass,
		"pt-16 pb-6 lg:pt-24 lg:pb-8",
		className,
	);

	return (
		<Div className={combinedClassName} {...props}>
			{/* Heading slides up into view — primary focal point */}
			<SlideIn direction="up">
				<Heading variant="hero">
					{title} {brand && <Span className={brandClass}>{brand}</Span>}
				</Heading>
			</SlideIn>
			{/* Subtitle fades in slightly after the heading */}
			<FadeIn delay={0.15}>
				<Text variant="lead">{subtitle}</Text>
			</FadeIn>
		</Div>
	);
};

export { Hero, type HeroProps };
