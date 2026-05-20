export interface PaginationBarProps {
	/** The currently active page (1-indexed) */
	currentPage: number;

	/** Total number of pages available */
	totalPages: number;

	/** Called when the user clicks a page number or prev/next */
	onPageChange: (page: number) => void;

	/** Optional extra class for the wrapper nav element */
	className?: string;
}
