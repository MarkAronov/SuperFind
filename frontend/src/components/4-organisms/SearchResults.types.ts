import type { SearchResult } from "@/types/search.types";

// Page-based pagination passed down from the page so SearchResults owns the pagination bar
export interface SearchResultsPagination {
	// Currently active page (1-indexed)
	currentPage: number;
	// Total number of pages calculated from API total + limit
	totalPages: number;
	// Called when user clicks a page number
	onPageChange: (page: number) => void;
}

export interface SearchResultsProps {
	data: SearchResult;
	isLoading?: boolean;
	// Pagination state + handler — when provided, renders the numbered PaginationBar
	pagination?: SearchResultsPagination;
}
