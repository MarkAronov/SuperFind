import { MOTION } from "@/animations/0-tokens/tokens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type React from "react";
import type { ElementType } from "react";
import { GRID } from "../1-ions/grid";
import { ListItem } from "../2-atoms/List";
import { DescriptionCard } from "./cards/DescriptionCard";
import type {
	ColumnCount,
	GapSize,
	GridItem as GridItemData,
	GridItemProps,
	GridProps,
	MaxColumns,
	ResponsiveColumns,
} from "./Grid.types";

/**
 * Grid Component
 *
 * Pure layout organism — handles the responsive grid mechanism.
 * Delegates card rendering to DescriptionCard (default) or a custom `renderCard` function.
 *
 * SPACING SYSTEM (NO MANUAL ADJUSTMENTS NEEDED):
 * - Section spacing: Wrap Grid in <Section> for automatic mb-8 lg:mb-12 margins
 * - Card padding: CardContent automatically applies p-8 lg:p-12 (32px mobile, 48px desktop)
 * - Grid gaps: Controlled by gap prop (sm=16px, md=24px, lg=32px, xl=48px)
 * - No default margin: Grid has NO margin — Section component handles all section spacing
 *
 * SMART HEIGHT BEHAVIOR:
 * - 1-column layouts (maxColumns={1}): Cards fit content by default (stretchCards=false)
 * - Multi-column layouts (maxColumns={2-8}): Cards have equal heights by default (stretchCards=true)
 * - Override: Set stretchCards explicitly to override automatic behavior
 *
 * CUSTOM CONTENT STANDARDS (CRITICAL — MUST FOLLOW):
 * When using customContent instead of the default renderer, you MUST maintain consistency:
 *
 * 1. WIDTH & LAYOUT:
 *    - Use noWrapper: true and provide your own <Card fill>
 *    - ALWAYS add `fill` prop to Card to match grid cell width
 *    - Example: <Card fill><CardContent>...</CardContent></Card>
 *
 * 2. PADDING:
 *    - Use <CardContent> which applies standard p-8 lg:p-12
 *    - Never use custom padding classes on Card wrapper
 *
 * 3. TYPOGRAPHY:
 *    - Headings: Use <Heading variant="section|subsection|card">
 *    - Body text: Use <Text variant="body"> (text-sm lg:text-base)
 *    - Lead text: Use <Text variant="lead"> (text-base lg:text-xl)
 *    - Small text: Use <Text variant="small"> (text-xs lg:text-sm)
 *
 * Automatically adapts to viewport width:
 * - Mobile (< 768px): 1 column
 * - Tablet (768px - 1023px): 2 columns
 * - Desktop (>= 1024px): maxColumns (1-8)
 *
 * Or use the `columns` prop for full per-breakpoint control:
 * ```tsx
 * <Grid columns={{ base: 2, md: 3, lg: 6 }} />
 * ```
 *
 * Features:
 * - Data-driven card generation via DescriptionCard
 * - Responsive breakpoints
 * - Customizable gap sizes
 * - Same height or content-fit cards
 * - Configurable max columns
 * - Stagger entrance animation (motion.div path)
 * - Semantic list support (ul path, no animation)
 */

// ── Layout lookup tables ──────────────────────────────────────────────────────

const gapClasses: Record<GapSize, string> = {
	sm: GRID.GAP.md,
	md: GRID.GAP.lg,
	lg: GRID.GAP.xl,
	xl: GRID.GAP["2xl"],
};

const baseColumnClasses: Record<MaxColumns, string> = {
	1: GRID.COLUMNS[1],
	// 2-column layout: 1 col phones, 4 sub-columns sm+ for centering
	2: `${GRID.COLUMNS[1]} sm:${GRID.COLUMNS[4]}`,
	// 3-column layout: 1 col mobile, 2 cols tablet, 3 cols desktop (direct, no sub-columns)
	3: `${GRID.COLUMNS[1]} md:${GRID.COLUMNS[2]} lg:${GRID.COLUMNS[3]}`,
	// 4-column layout: 1 col mobile, 2 cols tablet, 4 cols desktop
	4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
	// 5-column layout: 1 col mobile, 2 cols tablet, 5 cols desktop
	5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
	// 6-column layout: 1 col mobile, 2 cols tablet, 6 cols desktop
	6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-6",
	// 7-column layout: 1 col mobile, 2 cols tablet, 4 cols desktop, 7 cols xl
	7: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7",
	// 8-column layout: 1 col mobile, 2 cols tablet, 4 cols desktop, 8 cols xl
	8: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8",
};

/**
 * Column class lookup for each breakpoint prefix
 * Maps a column count to its Tailwind class at a given breakpoint
 */
const columnClassMap: Record<ColumnCount, string> = {
	1: "grid-cols-1",
	2: "grid-cols-2",
	3: "grid-cols-3",
	4: "grid-cols-4",
	5: "grid-cols-5",
	6: "grid-cols-6",
	7: "grid-cols-7",
	8: "grid-cols-8",
};

/**
 * Breakpoint prefixes for Tailwind viewport responsive classes
 * "base" has no prefix (mobile-first default)
 */
const breakpointPrefixes: Record<keyof ResponsiveColumns, string> = {
	base: "",
	sm: "sm:",
	md: "md:",
	lg: "lg:",
	xl: "xl:",
	"2xl": "2xl:",
};

/**
 * Container query prefixes for Tailwind 4 @container responsive classes
 * Responds to the parent container's width instead of the viewport
 */
const containerBreakpointPrefixes: Record<keyof ResponsiveColumns, string> = {
	base: "",
	sm: "@sm:",
	md: "@md:",
	lg: "@lg:",
	xl: "@xl:",
	"2xl": "@2xl:",
};

// ── Helper functions ──────────────────────────────────────────────────────────

/**
 * Build responsive grid column classes from a ResponsiveColumns config.
 * Switches between viewport prefixes (md:) and container query prefixes (@md:)
 * based on the containerQuery flag.
 *
 * @example
 * buildResponsiveColumnClasses({ base: 2, md: 3, lg: 6 })
 * // → "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
 *
 * buildResponsiveColumnClasses({ base: 2, md: 3, lg: 6 }, true)
 * // → "grid-cols-2 @md:grid-cols-3 @lg:grid-cols-6"
 */
const buildResponsiveColumnClasses = (
	columns: ResponsiveColumns,
	containerQuery = false,
): string => {
	// Pick viewport or container query prefix set
	const prefixes = containerQuery
		? containerBreakpointPrefixes
		: breakpointPrefixes;

	// Ordered breakpoints from smallest to largest
	const breakpoints: (keyof ResponsiveColumns)[] = [
		"base",
		"sm",
		"md",
		"lg",
		"xl",
		"2xl",
	];

	return breakpoints
		.filter((bp) => columns[bp] !== undefined)
		.map((bp) => {
			const count = columns[bp] as ColumnCount;
			const prefix = prefixes[bp];
			return `${prefix}${columnClassMap[count]}`;
		})
		.join(" ");
};

/**
 * Calculate if item is in incomplete last row and should be centered.
 * Returns a Tailwind col-start class string or empty string.
 * Switches between viewport prefixes (md:) and container query prefixes (@md:)
 * based on the containerQuery flag.
 */
const getCenteringClass = (
	itemIndex: number,
	totalItems: number,
	maxColumns: MaxColumns,
	breakpoint: "base" | "md" | "lg",
	containerQuery = false,
): string => {
	if (maxColumns === 1) return "";

	// Determine actual column count at this breakpoint
	// For maxColumns=2: base=1, md=2 (sub-columns: 4), lg=2 (sub-columns: 4)
	// For maxColumns=3: base=1, md=2, lg=3 (direct columns, no sub-columns)
	let cols: number;
	if (breakpoint === "base") {
		cols = 1; // Mobile is always 1 column
	} else if (breakpoint === "md") {
		cols = 2; // Tablet is 2 columns for both maxColumns=2 and maxColumns=3
	} else {
		// lg breakpoint
		cols = maxColumns; // Desktop shows maxColumns
	}

	const remainder = totalItems % cols;

	// If evenly divisible, no centering needed
	if (remainder === 0) return "";

	// Check if this item is in the last incomplete row
	const isInLastRow = itemIndex >= totalItems - remainder;
	if (!isInLastRow) return "";

	// Position within the last row (0-indexed)
	const posInLastRow = itemIndex - (totalItems - remainder);

	let colStart: number;

	// For maxColumns=2, use sub-column logic (4 sub-columns, span 2 each)
	if (maxColumns === 2 && breakpoint !== "base") {
		// 4 sub-columns total, each card spans 2
		const subCols = 4;
		const offset = Math.floor((subCols - remainder * 2) / 2) + 1;
		colStart = offset + posInLastRow * 2;
	}
	// For maxColumns=3, use direct column positioning (no sub-columns)
	else if (maxColumns === 3 && breakpoint === "lg") {
		// 3 direct columns
		// 1 item: center at col 2
		// 2 items: start at col 1 (left-aligned looks better than trying to center)
		if (remainder === 1) {
			colStart = 2; // Middle column
		} else {
			return ""; // 2 items: left-align
		}
	}
	// For tablet (md) with maxColumns=3: use 2-column centering
	else if (maxColumns === 3 && breakpoint === "md") {
		// 2 columns on tablet
		if (remainder === 1) {
			colStart = 2; // Center single item
		} else {
			return ""; // 2 items fills the row
		}
	} else {
		return "";
	}

	// Apply appropriate prefix — viewport (md:, lg:) or container query (@md:, @lg:)
	const mdPrefix = containerQuery ? "@md:" : "md:";
	const lgPrefix = containerQuery ? "@lg:" : "lg:";
	const prefix =
		breakpoint === "md" ? mdPrefix : breakpoint === "lg" ? lgPrefix : "";

	if (colStart === 2) return `${prefix}col-start-2`;
	if (colStart === 3) return `${prefix}col-start-3`;
	if (colStart === 4) return `${prefix}col-start-4`;

	return "";
};

// ── Components ────────────────────────────────────────────────────────────────

/**
 * Grid
 *
 * Responsive grid container. Renders items via DescriptionCard by default,
 * or via a custom `renderCard` function when provided.
 *
 * Exported as `Grid` to maintain backward compatibility with all consumers.
 */
export const Grid = ({
	items,
	children,
	columns,
	maxColumns = 3,
	gap = "md",
	containerClassName,
	stretchCards,
	centerIncompleteRows = false,
	enforceCustomContent = false,
	as = "div",
	renderCard,
	className,
	// Container query mode — grid responds to its own width, not the viewport
	containerQuery = false,
	...props
}: GridProps) => {
	// Determine effective max columns for stretch/centering logic.
	// When using responsive columns, use the largest specified breakpoint value.
	const effectiveMaxColumns: MaxColumns = columns
		? (Math.max(
				...(Object.values(columns).filter(Boolean) as number[]),
			) as MaxColumns)
		: maxColumns;

	// Auto-disable stretchCards for 1-column layouts (cards should fit content).
	// For multi-column layouts, default to true (cards should align heights).
	const shouldStretch = stretchCards ?? effectiveMaxColumns > 1;

	// Build grid column classes — `columns` prop > container query tokens > viewport breakpoints
	// When both `columns` and `containerQuery` are provided, use container query prefixes (@md:) instead of viewport (md:)
	const columnClasses = columns
		? buildResponsiveColumnClasses(columns, containerQuery)
		: containerQuery
			? GRID.CONTAINER_COLUMNS[maxColumns]
			: baseColumnClasses[maxColumns];

	const gridClasses = cn(
		"grid",
		columnClasses,
		gapClasses[gap],
		// Equal height rows when stretchCards is true
		shouldStretch && "auto-rows-fr",
		containerClassName,
		className,
	);

	const Component = as as ElementType;

	// Default render: delegate to DescriptionCard, passing enforceCustomContent through
	const cardRenderer =
		renderCard ||
		((item: GridItemData) => (
			<DescriptionCard
				item={item}
				enforceCustomContent={enforceCustomContent}
			/>
		));

	const totalItems = items?.length || 0;

	// When container query mode is active, wrap the grid in @container so it
	// responds to its own width rather than the viewport — more reusable in any layout context
	const wrapIfContainer = (content: React.ReactElement): React.ReactElement =>
		containerQuery ? <div className="@container">{content}</div> : content;

	// Children mode: backward compatibility for manual card rendering
	if (children) {
		return wrapIfContainer(
			<Component className={gridClasses} {...props}>
				{children}
			</Component>,
		);
	}

	// ul / semantic-list case: plain markup, no stagger animation needed for lists
	if (as === "ul") {
		return wrapIfContainer(
			<Component className={gridClasses} {...props}>
				{items?.map((item, index) => {
					const key = item.id || item.title || index;

					// Calculate centering offsets for incomplete last rows
					const mdCentering =
						centerIncompleteRows && maxColumns === 3
							? getCenteringClass(
									index,
									totalItems,
									maxColumns,
									"md",
									containerQuery,
								)
							: "";
					const smCentering =
						centerIncompleteRows && maxColumns === 2
							? getCenteringClass(index, totalItems, 2, "md", containerQuery)
							: "";
					const lgCentering = centerIncompleteRows
						? getCenteringClass(
								index,
								totalItems,
								maxColumns,
								"lg",
								containerQuery,
							)
						: "";

					const spanClass = cn(
						// Viewport mode: 4 sub-cols trick needs col-span-2 to make 2-col layout.
						// Container query mode: uses @md:grid-cols-2 (2 direct cols) — no span needed.
						maxColumns === 2 && !containerQuery && "sm:col-span-2",
						mdCentering,
						// Viewport mode: smCentering already carries "md:" prefix; wrap with "sm:" for the
						// sm-breakpoint 4-sub-col grid (existing behavior preserved).
						// Container query mode: smCentering already carries "@md:" — use directly.
						containerQuery ? smCentering : smCentering && `sm:${smCentering}`,
						lgCentering,
					);

					return (
						<ListItem key={key} className={spanClass}>
							{cardRenderer(item)}
						</ListItem>
					);
				})}
			</Component>,
		);
	}

	// div (default) case: motion.div grid acts as the stagger orchestrator.
	// Each card item fades + slides in sequentially as the grid enters the viewport.
	//
	// Type note: GridProps intersects ComponentProps<"div"> & ComponentProps<"ul">.
	// framer-motion overrides React's onAnimationStart/onDragStart with incompatible signatures.
	// This is a type-level only conflict — Omit the overridden events before spreading.
	type MotionSafeDivProps = Omit<
		React.HTMLAttributes<HTMLDivElement>,
		| "onAnimationStart"
		| "onAnimationEnd"
		| "onAnimationIteration"
		| "onDragStart"
		| "onDrag"
		| "onDragEnd"
		| "onDragEnter"
		| "onDragExit"
		| "onDragLeave"
		| "onDragOver"
		| "onDrop"
	>;
	const motionSafeProps = props as MotionSafeDivProps;

	return wrapIfContainer(
		<motion.div
			className={gridClasses}
			// Trigger once when at least 5% of the grid is in view
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.05 }}
			// Stagger container variant distributes timing across children
			variants={MOTION.stagger.container}
			{...motionSafeProps}
		>
			{items?.map((item, index) => {
				const key = item.id || item.title || index;

				// Calculate centering for incomplete rows (only if enabled)
				const mdCentering =
					centerIncompleteRows && maxColumns === 3
						? getCenteringClass(
								index,
								totalItems,
								maxColumns,
								"md",
								containerQuery,
							)
						: "";
				const smCentering =
					centerIncompleteRows && maxColumns === 2
						? getCenteringClass(index, totalItems, 2, "md", containerQuery)
						: "";
				const lgCentering = centerIncompleteRows
					? getCenteringClass(
							index,
							totalItems,
							maxColumns,
							"lg",
							containerQuery,
						)
					: "";

				// Column span + centering for incomplete last rows
				const spanClass = cn(
					// Viewport mode: 4 sub-cols trick needs col-span-2 to make 2-col layout.
					// Container query mode: uses @md:grid-cols-2 (2 direct cols) — no span needed.
					maxColumns === 2 && !containerQuery && "sm:col-span-2",
					mdCentering,
					// Viewport mode: smCentering already carries "md:" prefix; wrap with "sm:" for the
					// sm-breakpoint 4-sub-col grid (existing behavior preserved).
					// Container query mode: smCentering already carries "@md:" — use directly.
					containerQuery ? smCentering : smCentering && `sm:${smCentering}`,
					lgCentering,
				);

				// Each item inherits "hidden"/"visible" state from the stagger container
				return (
					<motion.div
						key={key}
						className={spanClass}
						variants={MOTION.stagger.item}
					>
						{cardRenderer(item)}
					</motion.div>
				);
			})}
		</motion.div>,
	);
};

/**
 * GridItem
 *
 * Optional wrapper for individual grid items when you need explicit control
 * over column spanning and row spanning.
 *
 * Exported as `GridItem` to maintain backward compatibility with all consumers.
 */
export const GridItem = ({
	colSpan,
	rowSpan,
	as = "div",
	className,
	children,
	...props
}: GridItemProps) => {
	const Component = as as ElementType;

	const spanClasses = cn(
		// Column spanning — responsive breakpoints match maxColumns behaviour
		colSpan === 2 && "md:col-span-2",
		colSpan === 3 && "lg:col-span-3",
		colSpan === 4 && "lg:col-span-4",
		colSpan === 5 && "lg:col-span-5",
		colSpan === 6 && "lg:col-span-6",
		colSpan === 7 && "xl:col-span-7",
		colSpan === 8 && "xl:col-span-8",
		// Row spanning
		rowSpan && `row-span-${rowSpan}`,
		className,
	);

	return (
		<Component className={spanClasses} {...props}>
			{children}
		</Component>
	);
};

// ── Exports ───────────────────────────────────────────────────────────────────

export type {
	ColumnCount,
	GapSize,
	GridItemProps,
	GridProps,
	MaxColumns,
	ResponsiveColumns,
};

// Re-export GridItem data type for consumers that previously imported from Grid
export type { GridItem as GridItemData } from "./cards/card.types";
