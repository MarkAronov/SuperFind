import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { TYPOGRAPHY } from "../1-ions/typography";
import type { SpanProps, SpanVariant } from "./Span.types";

/**
 * Span Component
 *
 * An inline text wrapper with semantic variants for different text purposes.
 * Use this for styling inline text that needs special treatment within paragraphs.
 */

/**
 * Variant styles mapping
 * Each variant serves a specific inline text purpose:
 * - default: Plain inline text with no special styling
 * - code: Inline code snippets with monospace font
 * - badge: Pill-shaped badge with background color
 * - tag: Compact tag for categorization
 * - muted: De-emphasized inline text
 */
const variantClasses: Record<SpanVariant, string> = {
	// Plain span - no special styling
	default: "",

	// Inline code - monospace font for code snippets (12px → 14px)
	code: TYPOGRAPHY.PRESETS.code,

	// Badge - pill-shaped with primary color background (14px, medium weight)
	badge: `px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary ${BORDERS.RADIUS.sm} ${TYPOGRAPHY.COMBINATIONS.badge}`,

	// Tag - compact categorization label (12px)
	tag: `px-2 py-1 bg-muted/50 ${BORDERS.RADIUS.sm} ${TYPOGRAPHY.COMBINATIONS.tag}`,

	// Muted text - de-emphasized inline content
	muted: "text-muted-foreground",
};

const Span = ({ className, variant = "default", ...props }: SpanProps) => {
	// Get the appropriate styling for the selected variant
	const variantClass = variantClasses[variant];

	// Combine variant styles with any custom classes
	const combinedClassName = cn(variantClass, className);

	return <span className={combinedClassName} {...props} />;
};

export { Span, type SpanProps, type SpanVariant };
