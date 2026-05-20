import type { ComponentProps, ReactNode } from "react";
import type { GridItem } from "./cards/card.types";

// Re-export GridItem for consumers that import it from Grid.types
export type { GridItem } from "./cards/card.types";

export type GapSize = "sm" | "md" | "lg" | "xl";
export type MaxColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Column count options for each breakpoint */
export type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Responsive column configuration
 *
 * Allows specifying the number of grid columns at each Tailwind breakpoint.
 * Only specify the breakpoints you need — unspecified ones inherit from
 * the nearest smaller breakpoint (CSS cascade behavior).
 *
 * Breakpoint widths:
 * - base: 0px+ (mobile-first default)
 * - sm: 640px+
 * - md: 768px+
 * - lg: 1024px+
 * - xl: 1280px+
 * - 2xl: 1536px+
 *
 * @example
 * // 2 cols mobile, 3 cols tablet, 6 cols desktop
 * columns={{ base: 2, md: 3, lg: 6 }}
 *
 * @example
 * // 1 col mobile, 2 cols sm, 3 cols md, 4 cols lg
 * columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
 */
export interface ResponsiveColumns {
	/** Base/mobile columns (0px+, default: 1) */
	base?: ColumnCount;
	/** Small breakpoint columns (640px+) */
	sm?: ColumnCount;
	/** Medium breakpoint columns (768px+) */
	md?: ColumnCount;
	/** Large breakpoint columns (1024px+) */
	lg?: ColumnCount;
	/** Extra-large breakpoint columns (1280px+) */
	xl?: ColumnCount;
	/** 2x extra-large breakpoint columns (1536px+) */
	"2xl"?: ColumnCount;
}

export interface GridBaseProps {
	/** Array of items to render as cards */
	items?: GridItem[];

	/** Children elements (for manual card rendering) */
	children?: ReactNode;

	/**
	 * Responsive column configuration per breakpoint.
	 * Takes precedence over maxColumns when provided.
	 *
	 * @example
	 * // 2 cols mobile, 3 cols tablet, 6 cols desktop
	 * columns={{ base: 2, md: 3, lg: 6 }}
	 */
	columns?: ResponsiveColumns;

	/**
	 * Maximum number of columns at largest breakpoint (1 to 8).
	 * Shorthand — uses preset responsive breakpoints.
	 * Ignored when `columns` prop is provided.
	 */
	maxColumns?: MaxColumns;

	/** Gap size between cards */
	gap?: GapSize;

	/** Custom class for the grid container */
	containerClassName?: string;

	/**
	 * Whether cards should have the same height (true) or fit content (false).
	 * Defaults to false for 1-column layouts, true for multi-column layouts.
	 * Set explicitly to override automatic behavior.
	 */
	stretchCards?: boolean;

	/**
	 * Whether to center incomplete last rows.
	 * - true: Centers odd items (good for finite "How It Works" sections)
	 * - false: Left-aligns all items (recommended for search results/long lists)
	 * Default: false
	 */
	centerIncompleteRows?: boolean;

	/** Use semantic list structure */
	as?: "div" | "ul";

	/** Custom render function for card content */
	renderCard?: (item: GridItem) => ReactNode;

	/** Enforce default card wrapper and baseline typography for custom content */
	enforceCustomContent?: boolean;

	/**
	 * Use CSS container queries instead of viewport breakpoints for column responsiveness.
	 * When true, the grid responds to its own width rather than the viewport width.
	 * Useful for grids placed inside sidebars, modals, or any variable-width containers.
	 * Default: false (viewport breakpoints)
	 */
	containerQuery?: boolean;
}

export type GridProps = GridBaseProps &
	Omit<ComponentProps<"div">, keyof GridBaseProps> &
	Omit<ComponentProps<"ul">, keyof GridBaseProps>;

export interface GridItemBaseProps {
	/** Span multiple columns (1-8) */
	colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

	/** Span multiple rows */
	rowSpan?: number;

	/** Children elements */
	children: ReactNode;

	/** Use semantic list item */
	as?: "div" | "li";
}

export type GridItemProps = GridItemBaseProps &
	Omit<ComponentProps<"div">, keyof GridItemBaseProps> &
	Omit<ComponentProps<"li">, keyof GridItemBaseProps>;
