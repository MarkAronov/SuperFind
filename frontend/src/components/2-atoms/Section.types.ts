import type { ComponentProps } from "react";

/** Size scale shared with Grid's gap prop */
export type SectionGap = "sm" | "md" | "lg" | "xl";

export type SectionVariant = "default" | "hero" | "spaced" | "compact";

export interface SectionProps extends ComponentProps<"section"> {
	/**
	 * Named variant for vertical padding.
	 * Used when Section wraps non-Grid content.
	 * Ignored when `gap` is provided.
	 */
	variant?: SectionVariant;

	/**
	 * Sync vertical padding with a Grid's gap size (2:1 ratio).
	 * Pass the same value you give to <Grid gap="...">.
	 * When provided, overrides `variant`.
	 *
	 * Ratio mapping (Section padding ≈ 2× Grid gap):
	 *   sm → py-8          (32px)   — Grid gap-4 (16px)
	 *   md → py-12         (48px)   — Grid gap-6 (24px)
	 *   lg → py-16         (64px)   — Grid gap-8 (32px)
	 *   xl → py-24         (96px)   — Grid gap-12 (48px)
	 */
	gap?: SectionGap;
}
