import { cn } from "@/lib/utils";
import { GRID } from "../1-ions/grid";
import { SPACING } from "../1-ions/spacing";
import type { GridProps, GridVariant } from "./Grid.types";

/**
 * Grid Component
 *
 * Responsive grid layout with common column patterns.
 * Built on CSS Grid for flexible, responsive card displays.
 */

/**
 * Variant styles mapping
 * Each variant provides a different grid pattern:
 * - features: 2-column responsive grid for feature cards
 * - cards: 1→2 column responsive grid for card layouts
 * - responsive: 1→2 column adaptive grid with large gaps
 */
const variantClasses: Record<GridVariant, string> = {
	// Features grid - 2 columns on small+, larger gaps on desktop
	features: `grid sm:${GRID.COLUMNS[2]} ${GRID.GAP.md} lg:${GRID.GAP.lg} ${SPACING.SECTION.sm} lg:${SPACING.SECTION.md}`,

	// Cards grid - responsive 1→2 columns with large gaps
	cards: `grid ${GRID.COLUMNS[1]} md:${GRID.COLUMNS[2]} ${GRID.GAP.lg} mb-16`,

	// Responsive grid - 1→2 columns with extra large gaps
	responsive: `grid ${GRID.COLUMNS[1]} md:${GRID.COLUMNS[2]} ${GRID.GAP.xl} lg:${GRID.GAP["2xl"]}`,
};

const Grid = ({ className, variant = "features", ...props }: GridProps) => {
	// Get the grid layout for the selected variant
	const gridClass = variantClasses[variant];

	// Combine grid layout with custom classes
	const combinedClassName = cn(gridClass, className);

	return <ul className={combinedClassName} {...props} />;
};

export { Grid, type GridProps, type GridVariant };
