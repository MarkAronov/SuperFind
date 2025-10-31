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

// Import Person type for use in functions below
import type { Person } from "../../../src/types/person.types";

/**
 * Person data as retrieved from API search results
 * Includes both the person data and metadata about storage
 */
export interface PersonSearchResult {
	id: string | number;
	score: number;
	person: Person;
	metadata: {
		md5?: string;
		stored_at?: string;
		fileName?: string;
		fileType?: string;
		entityType?: string;
		entityId?: string;
	};
}
