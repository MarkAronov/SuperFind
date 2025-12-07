/**
 * Shared Person type definitions for both frontend and backend
 * This ensures consistency in data structure across the entire application
 */

/**
 * Core Person interface - matches the structure stored in Qdrant
 * Important fields are required, optional fields are marked with ?
 */
export interface Person {
	// Core identity fields (REQUIRED)
	name: string;
	role: string;
	location: string;

	// Professional information (REQUIRED)
	skills: string | string[];
	experience: string | number;
	description: string;

	// Contact information (REQUIRED email, optional phone)
	email: string;
	phone?: string;

	// Location details (optional)
	city?: string;
	country?: string;

	// Additional professional information (optional)
	experience_years?: string | number;
	education?: string;
	certifications?: string | string[];

	// Optional biographical information
	bio?: string;
	summary?: string;
	achievements?: string | string[];
	languages?: string | string[];
	interests?: string | string[];

	// Social/professional links (optional)
	linkedin?: string;
	github?: string;
	website?: string;

	// Allow for additional dynamic fields from parsed data
	[key: string]: unknown;
}

/**
 * Validated Person - alias for Person since all required fields are enforced
 */
export type ValidatedPerson = Person;

/**
 * Person metadata stored in Qdrant payload
 */
export interface PersonMetadata {
	// Entity information (REQUIRED)
	entityType: "person";
	entityId: string;
	personName: string;

	// Core fields (REQUIRED in metadata)
	role: string;
	location: string;
	skills: string | string[];
	experience: string | number;
	email: string;

	// File source metadata (optional)
	fileName?: string;
	filePath?: string;
	fileType?: string;
	personHash?: string;
	stored_at?: string;

	// Allow additional metadata fields
	[key: string]: unknown;
}

/**
 * Validation result for person data
 */
export interface PersonValidationResult {
	isValid: boolean;
	person?: ValidatedPerson;
	missingFields: string[];
	errors: string[];
}

/**
 * Qdrant Person - Extended person type with additional metadata for Qdrant storage
 * This type combines core Person data with Qdrant-specific metadata
 */
export interface QdrantPerson extends Person {
	// Qdrant-specific metadata
	id?: string; // Qdrant point ID
	entityType: "person";
	entityId: string;
	personHash?: string; // Person identity hash for duplicate detection
	stored_at?: string; // Timestamp when stored
	fileName?: string; // Source file name
	filePath?: string; // Full source file path
	fileType?: string; // Source file type (csv, json, txt)
	source?: string; // Data source identifier
}

/**
 * Qdrant payload - complete data structure for storing in Qdrant
 */
export interface QdrantPayload {
	// Person core data
	person: QdrantPerson;
	// Vector metadata for search
	metadata: PersonMetadata;
}

/**
 * Re-export validation functions from person.validators
 * Import them here for backward compatibility with existing imports
 */
export {
	generatePersonHash,
	isValidPerson,
	normalizePerson,
	validatePerson,
} from "./person-validators";
