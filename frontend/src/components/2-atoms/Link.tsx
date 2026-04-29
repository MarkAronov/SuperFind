import { Link as RouterLink } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { MOTION } from "../animations/0-tokens/tokens";
import { MotionTextRipple } from "../animations/3-interactive/MotionTextRipple";
import type { LinkProps, LinkVariant } from "./Link.types";

/**
 * Link Component
 *
 * Unified link component handling both internal and external links.
 * Internal links use TanStack Router, external links use native <a> tags.
 *
 * Customization:
 * - Set `underline={false}` to remove underline styles (useful for navigation menus)
 * - Use variants to control color and emphasis
 */

/**
 * Variant styles mapping
 * Each variant provides different visual emphasis.
 * hover:text-* and transition-colors classes are removed — Framer Motion MotionTextRipple
 * handles the color-change animation with a clipPath ripple from mouse entry direction.
 * active:text-accent kept as a touch-state fallback (CSS handles tap on mobile).
 */
const variantClasses: Record<LinkVariant, string> = {
	// Default link — no underline, color change handled by MotionTextRipple
	default: "active:text-accent",

	// Primary link - uses primary color, ripple transitions to accent
	primary: "text-primary active:text-accent",

	// Muted link - subtle foreground, ripple transitions to accent
	muted: "text-muted-foreground active:text-accent",

	// Underline link - always underlined, ripple transitions to accent
	underline: "underline active:text-accent",
};

const Link = ({
	className,
	variant = "default",
	external = false,
	href,
	underline = true,
	...props
}: LinkProps) => {
	// Get the visual style for the selected variant
	const variantClass = variantClasses[variant];

	// Remove underline classes if underline prop is false
	const processedVariantClass = underline
		? variantClass
		: variantClass.replace(/hover:underline|underline/g, "").trim();

	// Combine variant style with custom classes
	const combinedClassName = cn(processedVariantClass, className);

	// External or href links use native <a> tag
	if (external || href) {
		const children = props.children;

		// Resolve the raw children for MotionTextRipple wrapping
		const resolvedChildren =
			typeof children === "function"
				? children({ isActive: false, isTransitioning: false })
				: children;

		return (
			<a
				href={href}
				className={combinedClassName}
				{...(external && {
					target: "_blank",
					rel: "noopener noreferrer",
				})}
			>
				{/* Wrap with ripple so color change animates from mouse entry direction */}
				<MotionTextRipple hoverColor={MOTION.hover.link}>
					{resolvedChildren}
				</MotionTextRipple>
			</a>
		);
	}

	// Internal links use TanStack Router for SPA navigation
	// MotionTextRipple is rendered inside so it works with RouterLink's render prop
	return (
		<RouterLink className={combinedClassName} {...props}>
			{(renderProps) => {
				// TanStack Router children can be a function (render prop) or static nodes
				const resolvedChildren =
					typeof props.children === "function"
						? props.children(renderProps)
						: props.children;

				return (
					<MotionTextRipple hoverColor={MOTION.hover.link}>
						{resolvedChildren}
					</MotionTextRipple>
				);
			}}
		</RouterLink>
	);
};

export { Link, type LinkProps, type LinkVariant };
