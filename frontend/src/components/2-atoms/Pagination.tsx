import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../ui/pagination";
import type { PaginationBarProps } from "./Pagination.types";

/**
 * Build the list of page numbers to show, inserting '...' where pages are skipped.
 *
 * Strategy:
 * - Always show the first and last page
 * - Show one page on each side of the current page (the "window")
 * - Insert ellipsis wherever the gap between adjacent items is > 1
 *
 * Examples:
 *  total=10, current=1  → [1, 2, 'ellipsis-right', 10]
 *  total=10, current=5  → [1, 'ellipsis-left', 4, 5, 6, 'ellipsis-right', 10]
 *  total=10, current=9  → [1, 'ellipsis-left', 8, 9, 10]
 *  total=5,  current=3  → [1, 2, 3, 4, 5] (no ellipsis when total ≤ 7)
 *
 * Ellipsis items use stable string IDs ("ellipsis-left" / "ellipsis-right")
 * so React keys are never based on array index.
 */
const buildPageRange = (
	current: number,
	total: number,
): (number | "ellipsis-left" | "ellipsis-right")[] => {
	// When pages fit in 7 slots, just return all page numbers sequentially
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}

	// Pages adjacent to the current page (one on each side)
	const windowStart = Math.max(2, current - 1);
	const windowEnd = Math.min(total - 1, current + 1);

	const range: (number | "ellipsis-left" | "ellipsis-right")[] = [1];

	// Left ellipsis — gap between page 1 and the window start
	if (windowStart > 2) range.push("ellipsis-left");

	// Pages in the current window
	for (let p = windowStart; p <= windowEnd; p++) {
		range.push(p);
	}

	// Right ellipsis — gap between the window end and last page
	if (windowEnd < total - 1) range.push("ellipsis-right");

	range.push(total);

	return range;
};

/**
 * PaginationBar Atom
 *
 * Numbered page navigation bar built on top of shadcn/ui's Pagination
 * primitives. Renders clickable page numbers with smart ellipsis truncation:
 *
 *   < Previous  1  …  4  5  6  …  10  Next >
 *
 * Designed for SPA use: navigation is handled via `onPageChange` callbacks —
 * no href routing involved.
 */
export const PaginationBar = ({
	currentPage,
	totalPages,
	onPageChange,
	className,
}: PaginationBarProps) => {
	// Nothing to show when there is only one page
	if (totalPages <= 1) return null;

	// Generate the list of page markers (numbers + ellipsis placeholders)
	const pageRange = buildPageRange(currentPage, totalPages);

	// Guard against going outside valid range
	const goTo = (page: number) => {
		const clamped = Math.max(1, Math.min(totalPages, page));
		if (clamped !== currentPage) onPageChange(clamped);
	};

	return (
		<Pagination className={className}>
			<PaginationContent>
				{/* Previous page button */}
				<PaginationItem>
					<PaginationPrevious
						onClick={(e) => {
							e.preventDefault();
							goTo(currentPage - 1);
						}}
						// Visually disable at first page via reduced opacity + no-pointer
						className={
							currentPage === 1
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>

				{/* Numbered pages + ellipsis */}
				{pageRange.map((item) =>
					typeof item === "string" ? (
						// Ellipsis placeholder — stable key "ellipsis-left" or "ellipsis-right"
						<PaginationItem key={item}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						// Clickable page number — page number itself is a unique key
						<PaginationItem key={item}>
							<PaginationLink
								isActive={item === currentPage}
								onClick={(e) => {
									e.preventDefault();
									goTo(item);
								}}
								className="cursor-pointer"
							>
								{item}
							</PaginationLink>
						</PaginationItem>
					),
				)}

				{/* Next page button */}
				<PaginationItem>
					<PaginationNext
						onClick={(e) => {
							e.preventDefault();
							goTo(currentPage + 1);
						}}
						// Visually disable at last page via reduced opacity + no-pointer
						className={
							currentPage === totalPages
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export type { PaginationBarProps };
