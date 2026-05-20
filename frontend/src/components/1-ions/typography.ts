/**
 * IONS: Design Tokens - Typography
 *
 * Font families, sizes, weights, line heights, and letter spacing.
 * Defines the complete type system for consistent text rendering.
 *
 * Font Family Strategy:
 * - sans: Apple's SF Pro stack (apple.com) — -apple-system → SF Pro → Helvetica Neue → Arial
 * - serif: Editorial stack modeled on Washington Post (Postoni) and NYT (nyt-cheltenham)
 * - mono: Fixed-width code fonts (code blocks, data tables)
 *
 * Font Size Scale (with line heights):
 * - xs: 12px/16px - Tiny text (labels, captions)
 * - sm: 14px/20px - Small text (body text, descriptions)
 * - base: 16px/24px - Default body text (paragraphs)
 * - lg: 18px/28px - Large body (comfortable reading)
 * - xl: 20px/28px - Small headings (card titles)
 * - 2xl: 24px/32px - Subheadings (section headers)
 * - 3xl: 30px/36px - Medium headings (page titles)
 * - 4xl: 36px/40px - Large headings (feature headers)
 * - 5xl: 48px - Hero headings (landing pages)
 * - 6xl-9xl: 60-128px - Display sizes (marketing, splash)
 *
 * Font Weight Scale:
 * - thin/extralight: 100-200 - Ultra light (decorative)
 * - light: 300 - Light (elegant, spacious)
 * - normal: 400 - Default body text
 * - medium: 500 - Subtle emphasis (labels)
 * - semibold: 600 - Strong emphasis (headings)
 * - bold: 700 - Primary headings (most headings)
 * - extrabold/black: 800-900 - Maximum weight (hero text)
 *
 * Line Height Guide:
 * - none: 1.0 - Tight (large display text)
 * - tight: 1.25 - Compact (headings)
 * - snug: 1.375 - Comfortable headings
 * - normal: 1.5 - Default body text (optimal reading)
 * - relaxed: 1.625 - Spacious (long-form content)
 * - loose: 2.0 - Maximum space (poetry, emphasis)
 *
 * Letter Spacing:
 * - tighter/tight: -0.05em to -0.025em - Condensed (headlines)
 * - normal: 0em - Default (most text)
 * - wide/wider/widest: 0.025em to 0.1em - Expanded (all-caps, labels)
 */

export const typography = {
	/**
	 * Font family stacks
	 * System font fallbacks for consistent cross-platform rendering
	 */
	fontFamily: {
		// Sans-serif: Apple's SF Pro stack — mirrors apple.com and Apple developer guidelines
		sans: [
			"-apple-system", // SF Pro Text/Display on Safari + WebKit (Apple's own CSS keyword)
			"BlinkMacSystemFont", // SF Pro on Chrome/Chromium on macOS
			"SF Pro Display", // Apple's display sans-serif — used on apple.com for headings
			"SF Pro Text", // Apple's text-optimized variant — optimized for body copy
			"SF Pro Icons", // Apple's icon companion font
			"Helvetica Neue", // Apple's pre-SF default — primary non-Apple fallback
			"Helvetica", // Classic Helvetica — macOS/print fallback
			"Arial", // Windows cross-platform fallback
			"sans-serif", // Generic system fallback
		],
		// Serif: Editorial reading fonts modeled on Washington Post (Postoni) and NYT (nyt-cheltenham)
		serif: [
			"Postoni", // Washington Post's primary editorial serif
			"nyt-cheltenham", // New York Times' iconic body text font (Cheltenham variant)
			"Georgia", // Best screen-optimized serif — primary web-safe fallback
			"Cambria", // High-quality Windows screen serif
			"Times New Roman", // Universal fallback
			"Times", // macOS/iOS fallback
			"serif", // Generic fallback
		],
		// Monospace: Fixed-width code fonts (code blocks, data)
		mono: [
			"ui-monospace",
			"SFMono-Regular",
			"Menlo",
			"Monaco",
			"Consolas",
			"Liberation Mono",
			"Courier New",
			"monospace",
		],
	},

	/**
	 * Font size scale with optimized line heights
	 * [fontSize, { lineHeight }] tuples for balanced typography
	 */
	fontSize: {
		xs: ["0.75rem", { lineHeight: "1rem" }], // 12px/16px - Tiny (labels)
		sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px/20px - Small (body)
		base: ["1rem", { lineHeight: "1.5rem" }], // 16px/24px - Default body
		lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px/28px - Large body
		xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px/28px - Small headings
		"2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px/32px - Subheadings
		"3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px/36px - Medium headings
		"4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px/40px - Large headings
		"5xl": ["3rem", { lineHeight: "1" }], // 48px - Hero headings
		"6xl": ["3.75rem", { lineHeight: "1" }], // 60px - Display
		"7xl": ["4.5rem", { lineHeight: "1" }], // 72px - Large display
		"8xl": ["6rem", { lineHeight: "1" }], // 96px - Huge display
		"9xl": ["8rem", { lineHeight: "1" }], // 128px - Maximum display
	},

	/**
	 * Font weight scale
	 * Controls text thickness from ultra-light to ultra-heavy
	 */
	fontWeight: {
		thin: "100", // 100 - Ultra light (decorative)
		extralight: "200", // 200 - Extra light (elegant)
		light: "300", // 300 - Light (refined)
		normal: "400", // 400 - Default body text
		medium: "500", // 500 - Subtle emphasis (labels)
		semibold: "600", // 600 - Strong emphasis (subheadings)
		bold: "700", // 700 - Primary headings
		extrabold: "800", // 800 - Extra bold (strong impact)
		black: "900", // 900 - Maximum weight (hero text)
	},

	/**
	 * Line height scale
	 * Controls vertical spacing between lines of text
	 */
	lineHeight: {
		none: "1", // 1.0 - Tight (large display text)
		tight: "1.25", // 1.25 - Compact (headings)
		snug: "1.375", // 1.375 - Comfortable headings
		normal: "1.5", // 1.5 - Default body (optimal reading)
		relaxed: "1.625", // 1.625 - Spacious (long-form)
		loose: "2", // 2.0 - Maximum space (emphasis)
	},

	/**
	 * Letter spacing scale
	 * Controls horizontal spacing between characters
	 */
	letterSpacing: {
		tighter: "-0.05em", // -0.05em - Very condensed (large headlines)
		tight: "-0.025em", // -0.025em - Condensed (headings)
		normal: "0em", // 0em - Default spacing
		wide: "0.025em", // 0.025em - Slightly expanded (labels)
		wider: "0.05em", // 0.05em - Expanded (all-caps)
		widest: "0.1em", // 0.1em - Maximum spacing (emphasis)
	},
} as const;

/**
 * TYPOGRAPHY - Tailwind class string constants
 * Use these in components for consistent typography
 */
export const TYPOGRAPHY = {
	/**
	 * Font family classes
	 * System font stacks for consistent rendering
	 */
	FONT_FAMILY: {
		sans: "font-sans", // System UI fonts (default)
		serif: "font-serif", // Traditional reading fonts
		mono: "font-mono", // Fixed-width code fonts
	},

	/**
	 * Font size classes with responsive variants
	 * Mobile → Desktop scaling for optimal readability
	 */
	FONT_SIZE: {
		xs: "text-xs", // 12px - Tiny labels
		sm: "text-sm", // 14px - Small text
		base: "text-base", // 16px - Default body
		lg: "text-lg", // 18px - Large body
		xl: "text-xl", // 20px - Small headings
		"2xl": "text-2xl", // 24px - Subheadings
		"3xl": "text-3xl", // 30px - Medium headings
		"4xl": "text-4xl", // 36px - Large headings
		"5xl": "text-5xl", // 48px - Hero headings

		// Responsive size combinations
		xs_sm: "text-xs lg:text-sm", // 12px → 14px
		sm_base: "text-sm lg:text-base", // 14px → 16px
		base_lg: "text-base lg:text-lg", // 16px → 18px
		lg_xl: "text-lg lg:text-xl", // 18px → 20px
	},

	/**
	 * Font weight classes
	 * Controls text thickness from light to heavy
	 */
	FONT_WEIGHT: {
		thin: "font-thin", // 100 - Ultra light
		light: "font-light", // 300 - Light
		normal: "font-normal", // 400 - Default body
		medium: "font-medium", // 500 - Subtle emphasis
		semibold: "font-semibold", // 600 - Strong emphasis
		bold: "font-bold", // 700 - Primary headings
		extrabold: "font-extrabold", // 800 - Extra bold
	},

	/**
	 * Preset combinations for common use cases
	 * Combines font family, size, and weight
	 */
	PRESETS: {
		// Code/data display - monospace with small responsive sizing (12px → 14px)
		code: "font-mono text-xs lg:text-sm",

		// Body text - default sans-serif (16px)
		body: "font-sans text-base",

		// Reading text - comfortable size for long-form (18px)
		reading: "font-sans text-lg",

		// Label text - small with medium weight (14px)
		label: "font-sans text-sm font-medium",
	},

	/**
	 * Common responsive size + weight combinations
	 * Used extensively across components
	 */
	COMBINATIONS: {
		// Typography for standard UI elements
		badge: "text-xs font-medium", // Badge/pill text
		tag: "text-xs", // Tag/category text
		caption: "text-xs text-muted-foreground", // Image captions, footnotes

		// Body text variants
		bodySmall: "text-sm lg:text-base", // Standard body (responsive)
		bodyLarge: "text-base lg:text-xl", // Lead/intro text
		bodyMuted: "text-sm lg:text-base text-muted-foreground", // Secondary text

		// Metadata/small text
		small: "text-xs lg:text-sm", // Compact metadata
		smallMuted: "text-xs lg:text-sm text-muted-foreground", // Muted metadata

		// Headings
		heroHeading: "text-3xl lg:text-5xl font-bold", // Hero/landing headings
		sectionHeading: "text-2xl lg:text-3xl font-bold", // Section headings
		subsectionHeading: "text-xl lg:text-2xl font-bold", // Subsection headings
		subheading: "text-base lg:text-lg font-semibold", // Subheading style for <p> elements
		cardHeading: "text-xl font-semibold", // Card/component headings
		mediumHeading: "text-lg lg:text-xl font-semibold", // Medium headings

		// Links & interactive elements
		link: "text-sm lg:text-base font-medium", // Standard links
		navLink: "font-medium", // Navigation links

		// Brand/logo
		brandText: "text-lg lg:text-xl font-bold", // Brand/logo text

		// Footer text
		footerHeading: "text-xs lg:text-sm font-semibold", // Footer section headings
		footerLink: "text-xs lg:text-sm", // Footer links
		footerCopyright: "text-xs lg:text-sm", // Copyright text
	},
} as const;

/**
 * Type helpers for typography tokens
 */
export type FontFamilyToken = keyof typeof typography.fontFamily;
export type FontSizeToken = keyof typeof typography.fontSize;
export type FontWeightToken = keyof typeof typography.fontWeight;
