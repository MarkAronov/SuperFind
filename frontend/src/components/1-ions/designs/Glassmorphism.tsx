import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useState } from "react";

/**
 * Glassmorphism Component - Pure Visual Primitive
 *
 * Provides glassmorphism effects for modern UI elements.
 * A pure visual primitive that applies frosted glass aesthetics.
 *
 * Visual Effects Applied:
 * - Backdrop blur: Creates frosted glass effect behind element
 * - Backdrop saturation: Enhances colors showing through glass
 * - Semi-transparent background: Allows content behind to show partially
 * - Noise texture overlay: Subtle grain for realistic glass texture
 * - Border radius: Smooth edges (inherited from parent or custom)
 *
 * What Glassmorphism Does NOT Provide (component responsibility):
 * - Borders: Components handle their own border styles
 * - Shadows: Components control shadow depth
 * - Padding: Components manage internal spacing
 * - Layout structure: Components define their own layout
 *
 * Variants:
 * - default: Standard glass effect (subtle blur, light transparency)
 * - card: Optimized for card elements (medium blur, card-like opacity)
 * - panel: For larger panel surfaces (similar to default)
 * - pronounced: Heavy glass effect (strong blur, more transparency)
 *
 * Constraint Mode:
 * - When enabled, centers element and applies max-width
 * - Default: max-w-2xl (672px) centered
 * - Custom: Provide maxWidthClass for different constraints
 */

export interface GlassmorphismProps extends HTMLAttributes<HTMLDivElement> {
	asChild?: boolean;
	variant?: "card" | "panel" | "default" | "pronounced";
	/**
	 * When true, constrains the width and centers the element.
	 * Defaults to `max-w-2xl mx-auto` unless `maxWidthClass` is provided.
	 */
	constrain?: boolean;
	maxWidthClass?: string;
}

export const Glassmorphism = ({
	className = "",
	asChild = false,
	variant = "default",
	constrain = false,
	maxWidthClass,
	children,
	...props
}: GlassmorphismProps) => {
	// Choose component type: Slot (inherit parent element) or div
	const Comp = asChild ? Slot : "div";

	// Base glass effect class (applies core blur and transparency)
	const base = "glass";

	// Variant-specific glass styling
	const variantClass =
		variant === "card"
			? "glass-card" // Card-optimized glass effect
			: variant === "pronounced"
				? "glass-pronounced" // Heavy glass effect
				: ""; // Default/panel use base only

	// Width constraint class (centers and limits width when enabled)
	const constraintClass = constrain
		? (maxWidthClass ?? "max-w-2xl mx-auto") // Default: 672px max width, centered
		: "";

	/**
	 * Randomize noise texture offset per-instance
	 * Prevents visible tiling patterns when multiple Glassmorphism elements render
	 * Only runs on client to avoid hydration mismatch
	 */
	const [noiseVars, setNoiseVars] = useState<Record<string, string> | null>(
		null,
	);

	useEffect(() => {
		// Only run on client side (after hydration)
		const size = 800; // Matches noise-size in CSS

		// Generate random offset within texture bounds
		const x = Math.floor(Math.random() * size);
		const y = Math.floor(Math.random() * size);

		// Set CSS custom properties for noise position
		setNoiseVars({
			"--noise-x": `${x}px`,
			"--noise-y": `${y}px`,
			"--noise-size": `${size}px ${size}px`,
		});
	}, []);

	// Combine all classes
	const combinedClassName = cn(base, variantClass, constraintClass, className);

	// Merge noise variables with any existing inline styles
	const combinedStyle = {
		...(props.style as CSSProperties),
		...(noiseVars as unknown as CSSProperties),
	};

	return (
		<Comp className={combinedClassName} style={combinedStyle} {...props}>
			{children}
		</Comp>
	);
};

// Named export alias for backwards compatibility
export { Glassmorphism as Glass };
export type { GlassmorphismProps as GlassProps };

export default Glassmorphism;
