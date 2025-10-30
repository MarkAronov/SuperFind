/**
 * Search API Response Types
 *
 * This file contains type definitions for the search API responses,
 * including search results, sources, and error handling.
 */

import type { Person } from "./person.types";

/**
 * Search API Response
 * Returned when performing a search query against the backend
 */
export interface SearchResult {
	success: boolean;
	query: string;
	answer?: string; // Optional - may not be present in error cases
	people?: PersonSearchResult[]; // Optional - may not be present in error cases
	sources?: Source[]; // Optional - may not be present in error cases
	timestamp: string;
	error?: string; // Optional - present in error cases
	details?: string; // Optional - present in error cases
}

/**
 * Person search result with relevance score
 * Contains the person data and search-specific metadata
 */
export interface PersonSearchResult {
	id: string | number;
	score: number; // 0-1 score indicating match quality
	person: Person;
	metadata?: {
		md5?: string;
		stored_at?: string;
		fileName?: string;
		fileType?: string;
		entityType?: string;
		entityId?: string;
		rawContent?: string;
		[key: string]: unknown;
	};
}

/**
 * Source document metadata
 * Represents a source document that was used to generate the search results
 */
export interface Source {
	id: string;
	content: string;
	metadata: Record<string, unknown>;
	relevanceScore: number;
}

// Re-export Person for convenience
export type { Person } from "./person.types";

/**
 * API Error Response
 * Standard error format returned by the API
 */
export interface ApiError {
	message: string;
	status?: number;
}
