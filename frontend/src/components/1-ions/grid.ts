/**
 * IONS: Grid Tokens
 *
 * CSS Grid system primitives for layout structures.
 * Provides column/row definitions, spacing, and flow control.
 *
 * Column System:
 * - 1-12 columns: Standard grid divisions
 * - Common patterns: 2 (50/50), 3 (33/33/33), 4 (25/25/25/25), 12 (precise control)
 * - Combine with responsive prefixes: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
 *
 * Row System:
 * - 1-6 rows: Explicit row definitions
 * - Use when vertical structure matters (equal height cards, dashboards)
 *
 * Gap Scale:
 * - none: 0px - No spacing between grid items
 * - xs: 4px - Minimal separation (compact lists)
 * - sm: 8px - Tight spacing (dense grids)
 * - md: 16px - Standard spacing (default cards)
 * - lg: 24px - Comfortable spacing (feature grids)
 * - xl: 32px - Generous spacing (hero sections)
 * - 2xl: 48px - Maximum spacing (major sections)
 *
 * Flow Control:
 * - row: Fill rows first, then columns (default, left-to-right)
 * - col: Fill columns first, then rows (top-to-bottom)
 * - rowDense/colDense: Pack items tightly, filling gaps (masonry-like)
 */

export const GRID = {
	/**
	 * Column count tokens
	 * Defines number of equal-width columns in grid
	 */
	COLUMNS: {
		1: "grid-cols-1", // 1 column (mobile, full-width)
		2: "grid-cols-2", // 2 columns (50/50 split)
		3: "grid-cols-3", // 3 columns (thirds)
		4: "grid-cols-4", // 4 columns (quarters, cards)
		5: "grid-cols-5", // 5 columns (special layouts)
		6: "grid-cols-6", // 6 columns (complex grids)
		8: "grid-cols-8", // 8 columns (detailed layouts)
		12: "grid-cols-12", // 12 columns (maximum flexibility)
	},

	/**
	 * Row count tokens
	 * Defines number of equal-height rows in grid
	 */
	ROWS: {
		1: "grid-rows-1", // 1 row (single horizontal strip)
		2: "grid-rows-2", // 2 rows (top/bottom split)
		3: "grid-rows-3", // 3 rows (vertical thirds)
		4: "grid-rows-4", // 4 rows (quarters)
		6: "grid-rows-6", // 6 rows (complex vertical layouts)
	},

	/**
	 * Gap spacing tokens
	 * Space between grid items (applies to both rows and columns)
	 */
	GAP: {
		none: "gap-0", // 0px - No spacing
		xs: "gap-1", // 4px - Minimal (compact lists)
		sm: "gap-2", // 8px - Tight (dense grids)
		md: "gap-4", // 16px - Standard (default spacing)
		lg: "gap-6", // 24px - Comfortable (feature grids)
		xl: "gap-8", // 32px - Generous (hero sections)
		"2xl": "gap-12", // 48px - Maximum (major sections)
	},

	/**
	 * Grid flow tokens
	 * Controls how auto-placed items fill the grid
	 */
	FLOW: {
		row: "grid-flow-row", // Fill rows first (left-to-right, then down)
		col: "grid-flow-col", // Fill columns first (top-to-bottom, then right)
		rowDense: "grid-flow-row-dense", // Pack rows, fill gaps (masonry)
		colDense: "grid-flow-col-dense", // Pack columns, fill gaps (vertical masonry)
	},

	/**
	 * Container query column tokens (Tailwind 4 native)
	 * Responds to the parent container's inline size instead of the viewport.
	 * Requires a @container ancestor — Grid adds this automatically when containerQuery={true}.
	 *
	 * Breakpoints map to container inline size (same pixel scale as viewport breakpoints):
	 * - @md: container >= 768px  → 2 columns
	 * - @lg: container >= 1024px → max columns
	 * - @xl: container >= 1280px → extra columns (7–8 col layouts only)
	 *
	 * Use cases: sidebars, modals, cards placed in variable-width containers
	 */
	CONTAINER_COLUMNS: {
		1: "grid-cols-1", // Always 1 col — no breakpoints needed
		2: "grid-cols-1 @md:grid-cols-2", // 1 col → 2 cols at md
		3: "grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3", // 1 → 2 → 3 cols
		4: "grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4", // 1 → 2 → 4 cols
		5: "grid-cols-1 @md:grid-cols-2 @lg:grid-cols-5", // 1 → 2 → 5 cols
		6: "grid-cols-1 @md:grid-cols-2 @lg:grid-cols-6", // 1 → 2 → 6 cols
		7: "grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 @xl:grid-cols-7", // 1 → 2 → 4 → 7 cols
		8: "grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 @xl:grid-cols-8", // 1 → 2 → 4 → 8 cols
	},
} as const;
