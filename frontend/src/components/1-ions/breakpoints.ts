/**
 * IONS: Breakpoint Tokens
 *
 * Media query breakpoints for responsive design.
 * Defines viewport width thresholds for adaptive layouts across device sizes.
 *
 * Breakpoint Scale:
 * - sm: 640px - Small tablets portrait, large phones landscape
 * - md: 768px - Tablets portrait, standard iPad
 * - lg: 1024px - Tablets landscape, small laptops
 * - xl: 1280px - Desktop monitors, laptops
 * - 2xl: 1536px - Large desktop displays, external monitors
 *
 * Mobile-First Strategy:
 * - Base styles apply to mobile (< 640px)
 * - Use prefixes (sm:, md:, etc.) to override at larger sizes
 * - Example: "text-sm md:text-base lg:text-lg" grows text with viewport
 */

/**
 * Breakpoint pixel values
 * Raw width values for CSS media queries
 */
export const BREAKPOINTS = {
	sm: "640px", // 640px - Small tablets portrait
	md: "768px", // 768px - Tablets portrait (iPad)
	lg: "1024px", // 1024px - Tablets landscape, small laptops
	xl: "1280px", // 1280px - Desktop monitors
	"2xl": "1536px", // 1536px - Large desktop displays
} as const;

/**
 * Tailwind responsive prefixes
 * Used for applying styles at specific breakpoints and above
 *
 * Usage Examples:
 * - "hidden md:block" - Hidden on mobile, visible on tablets+
 * - "grid-cols-1 lg:grid-cols-3" - 1 column mobile, 3 on desktop
 * - "p-4 xl:p-8" - 16px padding mobile, 32px on large screens
 */
export const RESPONSIVE_PREFIXES = {
	sm: "sm:", // Apply at 640px and above
	md: "md:", // Apply at 768px and above
	lg: "lg:", // Apply at 1024px and above
	xl: "xl:", // Apply at 1280px and above
	"2xl": "2xl:", // Apply at 1536px and above
} as const;

/**
 * Tailwind 4 container query prefixes (native, no plugin needed)
 * Used for applying styles based on the parent @container's size, not the viewport.
 * Requires a @container ancestor element.
 *
 * Container breakpoints share the same pixel scale as viewport breakpoints:
 * - @sm: container >= 640px
 * - @md: container >= 768px
 * - @lg: container >= 1024px
 * - @xl: container >= 1280px
 * - @2xl: container >= 1536px
 *
 * Usage Examples:
 * - "@md:grid-cols-2" - 2 columns when container >= 768px
 * - "@lg:hidden" - Hidden when container >= 1024px
 * - "@sm:flex-row" - Row layout when container >= 640px
 */
export const CONTAINER_PREFIXES = {
	sm: "@sm:", // Container >= 640px
	md: "@md:", // Container >= 768px
	lg: "@lg:", // Container >= 1024px
	xl: "@xl:", // Container >= 1280px
	"2xl": "@2xl:", // Container >= 1536px
} as const;
