/**
 * Frontend Person types - imports from backend for consistency
 */

// Re-export Person types from backend
export type {
	Person,
	PersonMetadata,
	PersonValidationResult,
	QdrantPayload,
	QdrantPerson,
	ValidatedPerson,
} from "../../../src/types/person.types";

// Re-export validation functions
export {
	isValidPerson,
	validatePerson,
} from "../../../src/types/person.types";

// Re-export API types from search types for consistency
export type {
	ApiError,
	PersonSearchResult,
	SearchResult,
	Source,
} from "./search.types";
