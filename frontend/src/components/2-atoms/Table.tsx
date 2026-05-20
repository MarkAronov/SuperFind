import type * as React from "react";
import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { BORDERS } from "../1-ions/borders";
import { SPACING } from "../1-ions/spacing";
import { TYPOGRAPHY } from "../1-ions/typography";
import type { TableCellProps, TableProps, TableRowProps } from "./Table.types";

/**
 * Table Components - Professional Data Display
 *
 * Fully-featured table system with:
 * - Size variants (sm/md/lg) for different density needs
 * - Visual variants (default/striped/outlined) for aesthetics
 * - Layout modes (auto/fixed) - auto wraps content, fixed enables scroll
 * - Interactive hover states for better UX
 * - Sticky headers for long tables
 * - Column borders for visual separation
 *
 * Default behavior: auto layout with wrapping (no horizontal scroll)
 *
 * @example
 * ```tsx
 * <Table variant="striped" interactive>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Value</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Example</TableCell>
 *       <TableCell variant="code">value</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */

// Context to pass table configuration to child components
interface TableContextValue {
	size: "sm" | "md" | "lg";
	interactive: boolean;
	showColumnBorder: boolean;
}

const TableContext = createContext<TableContextValue>({
	size: "md",
	interactive: false,
	showColumnBorder: false,
});

/**
 * Size variant styles
 * Controls padding and font size for different density levels
 */
const sizeVariants = {
	// Compact - tight spacing for data-heavy tables (8px padding, 12px font)
	sm: {
		cell: cn(
			"px-2 py-1.5",
			TYPOGRAPHY.FONT_SIZE.xs,
			"break-words whitespace-normal [overflow-wrap:anywhere] min-w-0",
		), // 8px horizontal, 6px vertical, 12px font, force wrapping
		head: cn(
			"px-2 py-1.5",
			TYPOGRAPHY.FONT_SIZE.xs,
			TYPOGRAPHY.FONT_WEIGHT.semibold,
			"break-words whitespace-normal [overflow-wrap:anywhere] min-w-0",
		),
	},

	// Standard - balanced spacing (12px padding, 14px font)
	md: {
		cell: cn(
			SPACING.PADDING.sm,
			TYPOGRAPHY.FONT_SIZE.sm,
			"break-words whitespace-normal [overflow-wrap:anywhere] min-w-0",
		), // 12px padding, 14px font, force wrapping
		head: cn(
			SPACING.PADDING.sm,
			TYPOGRAPHY.FONT_SIZE.sm,
			TYPOGRAPHY.FONT_WEIGHT.semibold,
			"break-words whitespace-normal [overflow-wrap:anywhere] min-w-0",
		),
	},

	// Spacious - generous spacing for readability (16px padding, 16px font)
	lg: {
		cell: cn(
			SPACING.PADDING.md,
			TYPOGRAPHY.FONT_SIZE.base,
			"break-words whitespace-normal [overflow-wrap:anywhere] min-w-0",
		), // 16px padding, 16px font, force wrapping
		head: cn(
			SPACING.PADDING.md,
			TYPOGRAPHY.FONT_SIZE.base,
			TYPOGRAPHY.FONT_WEIGHT.semibold,
			"break-words whitespace-normal [overflow-wrap:anywhere] min-w-0",
		),
	},
};

/**
 * Visual variant styles
 * Different table aesthetics for various use cases
 */
const visualVariants = {
	// Simple - clean borderless design with spacing (default, modern look)
	simple: "[&_thead_tr]:border-b [&_tbody_tr]:border-0",

	// Minimal - only header divider, ultra-clean
	minimal:
		"[&_thead_tr]:border-b [&_thead_tr]:border-border/50 [&_tbody_tr]:border-0",

	// Striped - alternating row colors for better readability (no borders)
	striped:
		"[&_tbody_tr:nth-child(even)]:bg-muted/50 [&_tbody_tr]:border-0 [&_thead_tr]:border-b",

	// Outlined - prominent border around entire table with inner borders
	outlined: cn(
		BORDERS.WIDTH.thin,
		BORDERS.RADIUS.md,
		"border-border [&_thead_tr]:border-b [&_tbody_tr]:border-b [&_tbody_tr:last-child]:border-0",
	),
};

/**
 * Layout variant styles
 * Controls how table handles content overflow
 */
const layoutVariants = {
	// Auto - columns resize based on content, wraps naturally (default, prevents horizontal scroll)
	auto: "table-auto",

	// Fixed - fixed column widths, enables horizontal scroll
	fixed: "table-fixed",
};

/**
 * Table - Main container component
 *
 * Provides configuration context for child components.
 * Use layout="auto" (default) for wrapping behavior, "fixed" for horizontal scroll.
 *
 * Note: The ui/table component has a wrapper with overflow-x-auto.
 * We wrap it and override: auto layout removes overflow, fixed layout keeps it.
 */
const Table = ({
	className,
	size = "md",
	variant = "simple", // Default to simple (clean, borderless)
	layout = "auto", // Default to auto layout (wraps, no scroll)
	interactive = false,
	stickyHeader = false,
	showColumnBorder = false,
	children,
	...props
}: TableProps) => {
	// Get variant styles
	const variantClass = visualVariants[variant];
	const layoutClass = layoutVariants[layout];

	// Sticky header class
	const stickyClass = stickyHeader
		? "[&_thead]:sticky [&_thead]:top-0 [&_thead]:bg-background [&_thead]:z-10"
		: "";

	// Column border class
	const columnBorderClass = showColumnBorder
		? "[&_td]:border-r [&_th]:border-r [&_td:last-child]:border-r-0 [&_th:last-child]:border-r-0"
		: "";

	// Combine table classes
	const combinedClassName = cn(
		variantClass,
		layoutClass,
		stickyClass,
		columnBorderClass,
		className,
	);

	// Wrapper overflow — auto layout allows content to wrap (no horizontal scroll),
	// fixed layout enables horizontal scroll for wide tables
	const wrapperOverflow =
		layout === "auto" ? "overflow-visible" : "overflow-x-auto";

	// Provide context to child components
	const contextValue: TableContextValue = {
		size,
		interactive,
		showColumnBorder,
	};

	return (
		<TableContext.Provider value={contextValue}>
			{/* Outer scroll wrapper — overflow behavior depends on layout mode */}
			<div className={cn("relative w-full", wrapperOverflow)}>
				<table
					data-slot="table"
					className={cn("w-full caption-bottom text-sm", combinedClassName)}
					{...props}
				>
					{children}
				</table>
			</div>
		</TableContext.Provider>
	);
};

/**
 * TableHeader - Header section wrapper
 * Wraps native <thead> with a bottom border separating headers from body
 */
const TableHeader = ({
	className,
	...props
}: React.ComponentProps<"thead">) => (
	<thead
		data-slot="table-header"
		className={cn("[&_tr]:border-b", className)}
		{...props}
	/>
);

/**
 * TableBody - Body section wrapper
 * Wraps native <tbody>; removes border from last row to avoid double borders
 */
const TableBody = ({ className, ...props }: React.ComponentProps<"tbody">) => (
	<tbody
		data-slot="table-body"
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props}
	/>
);

/**
 * TableFooter - Footer section wrapper
 * Wraps native <tfoot> with muted background and top border
 */
const TableFooter = ({
	className,
	...props
}: React.ComponentProps<"tfoot">) => (
	<tfoot
		data-slot="table-footer"
		className={cn(
			"bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
			className,
		)}
		{...props}
	/>
);

/**
 * TableCaption - Table caption/title
 * Wraps native <caption>; positioned below the table by default (caption-bottom)
 */
const TableCaption = ({
	className,
	...props
}: React.ComponentProps<"caption">) => (
	<caption
		data-slot="table-caption"
		className={cn("text-muted-foreground mt-4 text-sm", className)}
		{...props}
	/>
);

/**
 * TableRow with interactive hover support
 *
 * Inherits interactive state from Table context or can be overridden per row.
 */
const TableRow = ({
	className,
	interactive: interactiveProp,
	...props
}: TableRowProps) => {
	// Get context
	const context = useContext(TableContext);

	// Use prop if provided, otherwise use context
	const isInteractive = interactiveProp ?? context.interactive;

	// Interactive hover styles
	const interactiveClass = isInteractive
		? "hover:bg-muted/50 transition-colors cursor-pointer"
		: "";

	// Combine classes
	const combinedClassName = cn(interactiveClass, className);

	return <tr data-slot="table-row" className={combinedClassName} {...props} />;
};

/**
 * TableHead - Header cell component
 *
 * Applies size-based padding and font styling from context.
 */
const TableHead = ({ className, ...props }: React.ComponentProps<"th">) => {
	// Get size from context
	const { size } = useContext(TableContext);

	// Get size-based head styles
	const sizeClass = sizeVariants[size].head;

	// Combine classes
	const combinedClassName = cn(sizeClass, className);

	return <th data-slot="table-head" className={combinedClassName} {...props} />;
};

/**
 * TableCell variant styles
 * Additional visual variants for cell content
 */
const cellContentVariants = {
	// Default cell - standard text
	default: "",

	// Code cell - monospace for technical data (12px → 14px)
	code: TYPOGRAPHY.PRESETS.code,

	// Muted cell - de-emphasized text
	muted: "text-muted-foreground",
};

/**
 * TableCell with variant and size support
 *
 * Enhanced table cell with:
 * - Size-based padding (from Table context)
 * - Content variants (default/code/muted)
 * - Column border support (from Table context)
 */
const TableCell = ({
	className,
	variant = "default",
	...props
}: TableCellProps) => {
	// Get size from context
	const { size } = useContext(TableContext);

	// Get size-based cell styles
	const sizeClass = sizeVariants[size].cell;

	// Get content variant styles
	const variantClass = cellContentVariants[variant];

	// Combine all classes
	const combinedClassName = cn(sizeClass, variantClass, className);

	return <td data-slot="table-cell" className={combinedClassName} {...props} />;
};

export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
	type TableCellProps,
	type TableProps,
	type TableRowProps,
};
